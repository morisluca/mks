import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { TrendingUp, Clock, Users } from "lucide-react";

export const TestimonialsSection = () => {
  const [api, setApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        api.scrollNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api, isHovered]);
 const testimonials = [
  {
    quote: "Marketcapsync’s analytics and trader insights helped me refine my strategy while still benefiting from expert trades. It’s the perfect balance.",
    author: "Daniel S.",
    title: "Quant Analyst",
    location: "Berlin",
    metrics: {
      return: "+172%",
      period: "13 mo",
      traders: "4 traders copied"
    }
  },
  {
    quote: "I appreciate how seamless everything feels. From onboarding to execution, it’s clear this platform was built with serious investors in mind.",
    author: "Olivia W.",
    title: "Asset Manager",
    location: "Sydney",
    metrics: {
      return: "+198%",
      period: "15 mo",
      traders: "3 traders copied"
    }
  },
  {
    quote: "The diversification options are outstanding. I can spread risk across multiple strategies without constantly monitoring the market.",
    author: "Carlos M.",
    title: "Entrepreneur",
    location: "Madrid",
    metrics: {
      return: "+164%",
      period: "11 mo",
      traders: "5 traders copied"
    }
  },
  {
    quote: "What impressed me most is the consistency. It’s not just about big gains—it’s about sustainable growth.",
    author: "Linda G.",
    title: "Wealth Consultant",
    location: "Dubai",
    metrics: {
      return: "+205%",
      period: "19 mo",
      traders: "4 traders copied"
    }
  },
  {
    quote: "The real-time mirroring is incredibly accurate. I’ve compared entries and exits, and they match almost perfectly.",
    author: "Kevin P.",
    title: "Crypto Trader",
    location: "Seoul",
    metrics: {
      return: "+233%",
      period: "17 mo",
      traders: "2 traders copied"
    }
  },
  {
    quote: "Marketcapsync gives me access to strategies I wouldn’t have the time or expertise to execute on my own.",
    author: "Nina B.",
    title: "Marketing Executive",
    location: "Amsterdam",
    metrics: {
      return: "+149%",
      period: "10 mo",
      traders: "3 traders copied"
    }
  },
  {
    quote: "I’ve seen steady growth month after month. The transparency makes it easy to trust the process.",
    author: "George H.",
    title: "Engineer",
    location: "Boston",
    metrics: {
      return: "+187%",
      period: "14 mo",
      traders: "4 traders copied"
    }
  },
  {
    quote: "Risk management tools are top-notch. I can adjust exposure easily and stay within my comfort zone.",
    author: "Fatima A.",
    title: "Banker",
    location: "Abu Dhabi",
    metrics: {
      return: "+176%",
      period: "12 mo",
      traders: "3 traders copied"
    }
  },
  {
    quote: "This platform has simplified investing for me. I don’t need to second-guess every move anymore.",
    author: "Victor D.",
    title: "Business Owner",
    location: "Johannesburg",
    metrics: {
      return: "+158%",
      period: "13 mo",
      traders: "2 traders copied"
    }
  },
  {
    quote: "Marketcapsync stands out for its reliability. Even during volatile markets, execution remains smooth and dependable.",
    author: "Hannah K.",
    title: "Economist",
    location: "Zurich",
    metrics: {
      return: "+212%",
      period: "18 mo",
      traders: "5 traders copied"
    }
  }
];

  return (
    <section className="py-32 px-[clamp(1.2rem,4vw,3.5rem)]">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-oc-accent" />
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-muted font-semibold">What Our Members Say</span>
          </div>
          <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light leading-[0.95] text-oc-text max-w-[700px]">
            Handpicked. Verified.
            <br />
            Consistent.
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <Carousel
            setApi={setApi}
            className="w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.author} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="border border-oc-text/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:shadow-xl hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 hover:border-oc-accent/30 hover:-translate-y-2 transition-all duration-500 group">
                  
                  <blockquote className="text-oc-muted leading-[1.8] mb-6 italic text-[1rem] font-medium relative">
                    <span className="text-oc-accent text-4xl leading-none absolute -top-2 -left-2">"</span>
                    {testimonial.quote}
                    <span className="text-oc-accent text-4xl leading-none absolute -bottom-4 -right-2">"</span>
                  </blockquote>

                  <div className="border-t border-oc-text/10 pt-6 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-oc-accent/20 rounded-full flex items-center justify-center text-oc-accent font-bold text-sm">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-oc-text text-[1rem]">{testimonial.author}</div>
                        <div className="text-[0.75rem] text-oc-muted">{testimonial.title}</div>
                      </div>
                    </div>
                    <div className="text-[0.7rem] text-oc-muted/70 ml-13">{testimonial.location}</div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <div className="flex-1 bg-oc-accent/10 rounded-xl p-3 text-center group-hover:bg-oc-accent/20 transition-colors">
                      <TrendingUp className="w-5 h-5 text-oc-accent mx-auto mb-1" />
                      <div className="font-bold text-lg text-oc-accent">{testimonial.metrics.return}</div>
                      <div className="text-xs text-oc-muted uppercase tracking-wide font-semibold">Return</div>
                    </div>
                    <div className="flex-1 bg-oc-text/5 rounded-xl p-3 text-center group-hover:bg-oc-text/10 transition-colors">
                      <Clock className="w-5 h-5 text-oc-text mx-auto mb-1" />
                      <div className="font-bold text-lg text-oc-text">{testimonial.metrics.period}</div>
                      <div className="text-xs text-oc-muted uppercase tracking-wide font-semibold">Period</div>
                    </div>
                    <div className="flex-1 bg-oc-text/5 rounded-xl p-3 text-center group-hover:bg-oc-text/10 transition-colors">
                      <Users className="w-5 h-5 text-oc-text mx-auto mb-1" />
                      <div className="font-bold text-lg text-oc-text">{testimonial.metrics.traders}</div>
                      <div className="text-xs text-oc-muted uppercase tracking-wide font-semibold">Traders</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-10 gap-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
