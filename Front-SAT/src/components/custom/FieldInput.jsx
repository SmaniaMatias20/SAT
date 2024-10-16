import { Input } from '../shadcn/input';
import { Label } from '../shadcn/label';

export function FieldInput({ label, id, type, value, setValor }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setValor(e.target.value)}
                className="input-class" // Asegúrate de usar la clase CSS que prefieras para estilizar
            />
        </div>
    );
}