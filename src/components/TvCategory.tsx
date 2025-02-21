import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export function TvCategory({
  name,
  id,
  description,
}: {
  name: string;
  id: string;
  description?: string;
}) {

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            redirect(`/series/${id}`);
          }}
        >
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
