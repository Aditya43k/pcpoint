import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-image");

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Expert Tech Support, Streamlined.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80 md:text-xl">
            Specialized in PC, laptop, and printer repairs. From hardware replacements to system upgrades, we provide fast, reliable, and transparent services.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/request">Submit a Service Request</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
