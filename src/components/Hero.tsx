
import { Button } from './ui/button';

export const Hero = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Delicious Food, Delivered to Your Door
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Experience the best local restaurants and artisanal food makers, all in one place. Fresh, fast, and fabulous.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
            View Menu
          </Button>
        </div>
      </div>
    </section>
  );
};
