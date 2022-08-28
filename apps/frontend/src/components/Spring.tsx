// author: @mrauro

import { motion } from "framer-motion";
import React from "react";

export default function Spring({ children }: { children: React.ReactNode }) {
  const arrayChildren = React.Children.toArray(children);

  return (
    <>
      {arrayChildren.map((child, index) => {
        return (
          <motion.div
            key={index}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              delay: index * 0.1,
              duration: 1,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </>
  );
}
