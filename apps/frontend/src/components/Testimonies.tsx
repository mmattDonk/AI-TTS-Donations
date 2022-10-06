import { Carousel } from "@mantine/carousel";
import { Group } from "@mantine/core";
import Image from "next/image";

function Testimonial() {
  return (
    <Group position="center">
      <div>
        <Image src="" alt="" />
      </div>
    </Group>
  );
}

export default function TestimoniesComponent() {
  return (
    <Carousel>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Testimonial key={i} />
      ))}
    </Carousel>
  );
}
