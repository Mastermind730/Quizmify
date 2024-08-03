"use client";
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import ReactWordcloud from 'react-wordcloud';

type Props = {
  formattedTopics: { text: string, value: number }[]
};

const fontSizeWrapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = ({ formattedTopics }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();

  const options = {
    fontFamily: "Times",
    fontSizes: [16, 50],  // Minimum and maximum font sizes
    rotations: 0,         // No rotation
    padding: 10,
    colors: [theme === "dark" ? "white" : "black"]
  };

  return (
    <>
      <ReactWordcloud
        // options={options}
        words={formattedTopics}
        callbacks={{
          onWordClick: (word) => {
            router.push(`/quiz?topic=${word.text}`);
          }
        }}
        size={[550, 600]}
      />
    </>
  );
};

export default CustomWordCloud;
