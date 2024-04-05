import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight",
        p: "leading-7 [&:not(:first-child)]:mt-6",
      },
    },
    defaultVariants: {
      variant: "p",
    },
  }
);

export interface TypographyProps
  extends VariantProps<typeof typographyVariants> {}

export function Typography({
  variant,
  children,
}: React.PropsWithChildren<TypographyProps>) {
  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Component className={cn(typographyVariants({ variant }))}>
      {children}
    </Component>
  );
}
