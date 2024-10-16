import Banner from "../Banner";
import { MonitorCog, CheckCheck, Leaf, CircuitBoard } from "lucide-react";



export function HomeAdmin() {
  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-white p-0 md:p-0 lg:p-0">
      <Banner />
      <div className="flex flex-col sm:flex-row h-auto md:h-48 items-center justify-center space-y-6 sm:space-y-0 sm:space-x-16 p-6 h-full w-full">
        <div className="flex flex-col items-center font">
          <CircuitBoard size={64} className="transition-transform duration-500 ease-in-out hover:rotate-180" />
          <h3 className="font-bold">COMPRESORES</h3>
        </div>
        <div className="flex flex-col items-center font">
          <CheckCheck size={64} className="transition-transform duration-500 ease-in-out hover:rotate-180" />
          <h3 className="font-bold">TRATAMIENTO</h3>
        </div>
        <div className="flex flex-col items-center font">
          <Leaf size={64} className="transition-transform duration-500 ease-in-out hover:rotate-180" />
          <h3 className="font-bold">EFICIENCIA ENERGÉTICA</h3>
        </div>
        <div className="flex flex-col items-center font">
          <MonitorCog size={64} className="transition-transform duration-500 ease-in-out hover:rotate-180" />
          <h3 className="font-bold">SERVICIO TÉCNICO</h3>
        </div>
      </div>
    </section>
  );
}
