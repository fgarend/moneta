"use client";

import { cn } from "cn";
import {
  SliderFill,
  Slider as SliderPrimitive,
  type SliderProps as SliderPrimitiveProps,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

type SliderValue = number | number[];
type SliderProps<T extends SliderValue = SliderValue> = Omit<
  SliderPrimitiveProps<T>,
  "className"
> & {
  className?: string;
};

function Slider<T extends SliderValue = SliderValue>({
  className,
  ...props
}: SliderProps<T>) {
  return (
    <SliderPrimitive
      className={cn(
        "group relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className,
      )}
      data-slot="slider"
      {...props}
    >
      {({ state }) => (
        <>
          <SliderTrack
            data-slot="slider-track"
            className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
          >
            <SliderFill
              data-slot="slider-range"
              className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
            />
          </SliderTrack>
          {/* A thumb is its place among the values, as React Aria's index says, so the place is its key too. */}
          {Array.from(state.values.keys()).map((place) => (
            <SliderThumb
              data-slot="slider-thumb"
              key={place}
              index={place}
              className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none group-data-horizontal:top-1/2 group-data-vertical:left-1/2 after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </>
      )}
    </SliderPrimitive>
  );
}

export { Slider };
