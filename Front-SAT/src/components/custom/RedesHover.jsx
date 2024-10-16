import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../shadcn/hover-card";

const RedesHover = ({ link, texto, imgsrc, children }) => {
  return (
    <HoverCard>
      {/* Aquí utilizamos el enlace directamente como trigger */}
      <HoverCardTrigger asChild>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button variant="link" className="text-base font-semibold">
            {children}
          </Button>
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex text-wrap space-x-1 items-center">
          <div className="h-full">
            <Avatar className="text-start m-1 ">
              <AvatarImage src={imgsrc} />
              <AvatarFallback>AvatarDMD</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left space-y-1.5 my-0.5">
            <h2 className="text-base font-semibold">@DMDcompresores</h2>
            <p>{texto}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export { RedesHover };
