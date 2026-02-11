
import re

file_path = 'a:/Dhruvam_site/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define new Vision Section
new_vision_html = """
    <section id="vision" class="py-32 px-6 md:px-16 relative overflow-hidden" style="background: transparent;">
        <!-- Background pulse effect -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div class="max-w-5xl mx-auto text-center relative z-10">
            <div class="section-divider mb-20"></div>

            <h2 class="text-5xl md:text-8xl font-black tracking-tighter mb-10 fade-in gradient-text" style="opacity: 0.9;">
                THE VISION
            </h2>
            
            <div class="space-y-10 fade-in">
                <p class="text-2xl md:text-5xl font-bold leading-tight text-white mb-8">
                    "The future isn't inherited.<br>It's <span class="gradient-accent">engineered</span>."
                </p>
                
                <p class="text-lg md:text-2xl leading-relaxed text-slate-400 max-w-3xl mx-auto font-light">
                    In a digital landscape cluttered with noise, I build clarity. 
                    I don't just write code; I architect living systems that breathe, adapt, and scale. 
                    My mission is to empower your business with pure, unadulterated intelligence that works silently in the background.
                </p>

                <div class="pt-12 flex justify-center gap-6">
                     <div class="flex items-center gap-2 text-blue-400">
                        <span class="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                        <span class="text-xs font-bold tracking-widest uppercase">System Online</span>
                     </div>
                </div>
            </div>
        </div>
    </section>
"""

# Replace existing Vision Section
# Match <section id="vision" ... </section>
vision_pattern = re.compile(r'<section id="vision".*?</section>', re.DOTALL)

if vision_pattern.search(content):
    content = re.sub(vision_pattern, new_vision_html, content)
    print("Replaced Vision Section with New Motivative Design.")
else:
    print("Warning: Could not find Vision Section to replace.")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
