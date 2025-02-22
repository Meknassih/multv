import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputWithLabelAndButton({
  id,
  type = "text",
  label,
  placeholder,
  buttonText = "Submit",
  onClick,
  value,
  onChange,
}: {
  id: string;
  type: string;
  label?: string;
  placeholder: string;
  buttonText: string;
  onClick: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type={type} id={id} placeholder={placeholder} value={value} onChange={onChange} />
        <Button onClick={onClick}>{buttonText}</Button>
      </div>
    </div>
  );
}
