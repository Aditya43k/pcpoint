import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench, ShieldCheck, Clock, BrainCircuit } from "lucide-react";

const features = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Comprehensive Repairs",
    description: "We handle everything from hardware failures to complex software issues on laptops, desktops, and more.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Expert Technicians",
    description: "Our certified technicians have the expertise to diagnose and resolve your tech problems efficiently and effectively.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Real-time Progress Updates",
    description: "Stay informed with live updates on your service request, from diagnosis to completion.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI-Powered Assignments",
    description: "Our smart system assigns the best technician for your specific issue, ensuring a faster and more accurate resolution.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
            Why Choose TechFlow?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We've built our service around efficiency, expertise, and transparency.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
