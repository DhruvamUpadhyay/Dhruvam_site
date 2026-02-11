
import re

file_path = 'a:/Dhruvam_site/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add 'contact-card' class to Social Media Links
# They currently look like: <a href="..." class="group block p-6 ...">
# We want: <a href="..." class="contact-card group block p-6 ...">
# Identify them by their hrefs or the "group block p-6" pattern inside the contact section?
# Or more safely, replacing the specific class string.

old_class = 'class="group block p-6 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-blue-500/10"'
new_class = 'class="contact-card group block p-6 rounded-lg bg-slate-900/40 border border-slate-800 transition-all"' 
# Note: I removed the hover:border-blue-500/50 etc because the new animation handles border and shadow.
# I kept transition-all.
# I also removed hover:translate-y-[-2px] because the new CSS handles lift.

if old_class in content:
    content = content.replace(old_class, new_class)
    print(f"Updated social card classes.")
else:
    print("Warning: Could not find exact social card class string. Trying regex/partial match.")
    # Fallback: look for "group block p-6" and "bg-slate-900/40"
    content = re.sub(r'class="group block p-6 rounded-lg bg-slate-900/40[^"]+"', 
                     'class="contact-card group block p-6 rounded-lg bg-slate-900/40 border border-slate-800 transition-all"', 
                     content)

# 2. Update CSS
# We need to find the block we just added/modified for .btn-tech-primary and extend it to .contact-card.

# Target: .btn-tech-primary { ... }
# Change to: .btn-tech-primary, .contact-card { ... }

# Target: .btn-tech-primary::before { ... }
# Change to: .btn-tech-primary::before, .contact-card::before { ... }

# Target: .btn-tech-primary:hover { ... }
# Change to: .btn-tech-primary:hover, .contact-card:hover { ... }

# Target: .btn-tech-primary:hover::before { ... }
# Change to: .btn-tech-primary:hover::before, .contact-card:hover::before { ... }

# Let's do this via regex replacements to be robust.

# Helper to add selector
def add_selector(input_content, base_selector, new_selector):
    # exact match
    # pattern: (\.btn-tech-primary)(\s*\{) -> \1, .new-selector \2
    pattern = re.compile(re.escape(base_selector) + r'(\s*\{)')
    if pattern.search(input_content):
        return re.sub(pattern, base_selector + ', ' + new_selector + r'\1', input_content)
    else:
        print(f"Warning: Could not find CSS rule for {base_selector}")
        return input_content

content = add_selector(content, '.btn-tech-primary', '.contact-card')
content = add_selector(content, '.btn-tech-primary::before', '.contact-card::before')
content = add_selector(content, '.btn-tech-primary:hover', '.contact-card:hover')
content = add_selector(content, '.btn-tech-primary:hover::before', '.contact-card:hover::before')

# 3. Validation / Clean up
# Ensure .contact-card has position relative if not inherited.
# .btn-tech-primary has position: relative. Since we grouped them, .contact-card gets it too.
# .btn-tech-primary has overflow: hidden. .contact-card gets it too. 
# This might clip the SVGs if they are large? No, p-6 provides padding.
# .btn-tech-primary has background: rgba(...).
# .contact-card already has inline bg-slate-900/40 (via tailwind).
# The CSS class properties will override or merge with Tailwind depending on specificity/order.
# Inline style/Tailwind classes usually win unless !important.
# BUT, we grouped them in the <style> tag.
# .btn-tech-primary defines `background`.
# .contact-card has `bg-slate-900/40` in HTML.
# If .contact-card shares the rule, it will get the `background` from CSS.
# That might be okay, or we might want to preserve the card's specific opacity.
# The social cards are `bg-slate-900/40`.
# The buttons are `rgba(2, 6, 23, 0.8)`.
# If we want them to look EXACTLY like buttons, we let the CSS win (or same background).
# The user said "apply the exact 'Service Box' border-outline hover effect". 
# They didn't explicitly say "change the background color".
# BUT Service Boxes have `background: #0F172A` (matches slate-900).
# So the background should be fine.

# One issue: `.btn-tech-primary` sets `display: inline-block`. 
# The cards are `block` (via Tailwind).
# CSS `display: inline-block` might break the grid/layout of the cards if they are expected to be full width or flex.
# The cards are inside `div class="fade-in space-y-6"`. They are `block`.
# If they become `inline-block`, they might sit next to each other or shrink?
# `space-y-6` adds margin-top to children.
# We should probably Force `display: block` for `.contact-card` specifically within the shared rule or override it.
# Actually, the grouping applies `display: inline-block`.
# We should separate the structural properties if they differ.

# Let's NOT group the main selector `.btn-tech-primary`.
# Let's ONLY group the `::before` and `:hover::before` and `:hover` shadow/transform.

# Undo the first replacement for .btn-tech-primary { ... }
# And instead add a separate rule for .contact-card that sets up the necessary properties for the effect:
# position: relative; overflow: hidden;
# And leaves display/background alone (or distinct).

# Reset content to reload to avoid mess
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
    
if old_class in content:
    content = content.replace(old_class, new_class)
else:
    content = re.sub(r'class="group block p-6 rounded-lg bg-slate-900/40[^"]+"', 
                     'class="contact-card group block p-6 rounded-lg bg-slate-900/40 border border-slate-800 transition-all"', 
                     content)

# Add setup CSS for contact-card
setup_css = """
        .contact-card {
            position: relative;
            overflow: hidden;
            /* Inherits display: block from Tailwind */
            /* Background handled by Tailwind */
        }
"""
content = content.replace('</style>', setup_css + '</style>')

# Now group the interaction/pseudo-elements which ARE shared perfectly.
content = add_selector(content, '.btn-tech-primary::before', '.contact-card::before')
content = add_selector(content, '.btn-tech-primary:hover', '.contact-card:hover')
content = add_selector(content, '.btn-tech-primary:hover::before', '.contact-card:hover::before')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Social Cards Updated.")
