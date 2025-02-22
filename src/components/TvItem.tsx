"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export function TvItem({
  name,
  id,
  description,
  image,
}: {
  name: string;
  id: string;
  description?: string;
  image?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {image && <Image src={image} alt={name} width={350} height={140} />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            router.push(`${pathname}/${id}`);
          }}
        >
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
