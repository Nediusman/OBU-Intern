import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  objectPosition?: string;
}

interface ImageCarouselProps {
  images: CarouselSlide[];
  interval?: number;
  showOverlay?: boolean;
  className?: string;
  children?: React.ReactNode;
  renderOverlay?: (slide: CarouselSlide) => React.ReactNode;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  overlayClassName?: string;
}

export function ImageCarousel({
  images,
  interval = 5000,
  showOverlay = false,
  className = "",
  children,
  renderOverlay,
  objectFit = "cover",
  objectPosition,
  overlayClassName,
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPaused = useRef(false);

  const clearTimers = () => {
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  };

  const startAutoPlay = useCallback(() => {
    clearTimers();
    autoPlayTimer.current = setInterval(() => {
      if (!isPaused.current) emblaApi?.scrollNext();
    }, interval);
  }, [emblaApi, interval]);

  const pauseAutoPlay = useCallback(() => {
    isPaused.current = true;
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, 8000);
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    pauseAutoPlay();
  }, [emblaApi, pauseAutoPlay]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    pauseAutoPlay();
  }, [emblaApi, pauseAutoPlay]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      pauseAutoPlay();
    },
    [emblaApi, pauseAutoPlay],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  useEffect(() => {
    startAutoPlay();
    return clearTimers;
  }, [startAutoPlay]);

  if (images.length === 0) return null;

  return (
    <div
      aria-label="Campus image slideshow"
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {images.map((slide, i) => (
            <div key={i} className="relative min-w-full flex-shrink-0 bg-[#0c3822]">
              {objectFit === "contain" && (
                <img
                  src={slide.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover blur-xl opacity-30"
                />
              )}
              <img
                src={slide.src}
                alt={slide.alt}
                className={`relative h-full w-full ${
                  objectFit === "contain" ? "object-contain" : "object-cover"
                } ${slide.objectPosition || objectPosition || "object-[center_20%]"}`}
              />
              {showOverlay && (
                <div
                  className={
                    overlayClassName ||
                    "absolute inset-0 bg-gradient-to-t from-[#0c3822]/85 via-transparent to-black/30"
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Text overlay content (passed as children for homepage hero) */}
      {showOverlay && children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}

      {/* Dynamic slide overlay */}
      {showOverlay && renderOverlay && images[selectedIndex] && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">{renderOverlay(images[selectedIndex])}</div>
        </div>
      )}

      {/* Slide title/subtitle overlay (for non-hero carousels) */}
      {showOverlay && !children && !renderOverlay && images[selectedIndex]?.title && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
          <div>
            <p className="text-lg font-semibold text-white">{images[selectedIndex].title}</p>
            {images[selectedIndex].subtitle && (
              <p className="mt-1 text-sm text-white/80">{images[selectedIndex].subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Prev / Next buttons */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
