import { Card, CardContent } from "../shadcn/card";
import image3 from "../../img/fabrica4.jpg";
import image2 from "../../img/FLOTA3.jpg";
import image1 from "../../img/FLOTA5.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../shadcn/carousel";

const slides = [
  { src: image3, alt: "Imagen 1" },
  { src: image2, alt: "Imagen 2" },
  { src: image1, alt: "Imagen 3" },
];

export default function Banner() {
  return (
    <section className="flex flex-col w-full">
      <div className="relative flex w-full ">
        <Carousel
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="w-full h-full m-0 p-0">
            {slides.map((slide, index) => (
              <CarouselItem
                key={index}
                className="w-full flex items-center justify-center m-0 p-0"
              >
                <div className="w-full h-full flex items-center justify-center ">
                  <Card className="w-full h-full m-0 p-0">
                    <CardContent className="flex items-center justify-center w-full h-full m-0 p-0">
                      <img src={slide.src} alt={slide.alt} className="brightness-50 " />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </div>
      <div className="flex flex-col bg-gradient-to-r from-gray-300 from-10% via-gray-200 via-30% to-gray-100 to-90% p-6 md:p-16 w-full">
        <div className="flex flex-col items-start w-full md:w-9/12 space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-left md:text-left">
            Líderes en ahorro energético...
          </h2>
          <p className="text-lg md:text-xl text-gray-600 text-left md:text-left">
            Diseñamos y brindamos soluciones integrales para el aire comprimido industrial.
          </p>
        </div>
      </div>
    </section>
  );
}
