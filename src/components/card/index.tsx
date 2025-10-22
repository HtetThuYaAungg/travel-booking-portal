import React, { ReactNode } from "react";
import {
  Card as ShadCnCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";

interface ICardComponentProps {
  title?: string;
  description?: string;
  imageSrc?: string | React.ReactNode;
  imageAlt?: string;
  className?: string;
  children: ReactNode;
}

const Card = (props: ICardComponentProps) => {
  const { title, description, imageSrc, imageAlt, className, children } = props;

  return (
    <ShadCnCard className={`w-[300px] sm:w-[400px] gap-5 ${className}`}>
      {(imageSrc || title || description) && (
        <CardHeader className="space-y-1 text-center">
          {imageSrc && (
            <CardTitle className="flex justify-center">
              {typeof imageSrc === "string" ? (
                <Image
                width={250}
                height={250}
                src={imageSrc}
                alt={imageAlt ?? ""}
                priority={false}
              />
              ) : (
                imageSrc
              )}
            </CardTitle>
          )}
          {title && <CardTitle className="text-2xl">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </ShadCnCard>
  );
};

export default Card;
