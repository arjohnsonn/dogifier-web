"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "./components/Button";
import { OrbitProgress } from "react-loading-indicators";
import submitImage from "./utils/submitImage";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <main className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#9b3a3a] to-[#262626]">
        <div className="flex flex-row justify-center w-full mt-12 csshadow">
          <h1 className="text-7xl font-bold text-white mr-3">Dogifier</h1>
          <Image
            src="/paw-print.svg"
            width={64}
            height={64}
            alt="Paw Print"
            className="w-16 h-16"
            style={{ filter: "brightness(0) invert(1)" }} // to make it white
          />
        </div>

        <h3 className="text-xl font-medium text-white text-center mt-5 csshadow">
          Add a dog to any photo using AI
        </h3>

        <div className="flex md:flex-row flex-col justify-center items-center w-full mt-12 gap-x-2">
          <div className="flex flex-col items-center mt-4">
            <p className="text-2xl csshadow font-bold text-white text-center">
              Example
            </p>
            <div className="flex flex-row justify-center items-center w-96 mt-2 gap-x-2">
              <ReactCompareSlider
                style={{ touchAction: "pan-y" }}
                onlyHandleDraggable={true}
                itemOne={
                  <ReactCompareSliderImage
                    src="/before.jpg"
                    srcSet="/before.jpg"
                    alt="Image one"
                    className="w-8 h-20"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src="/after.png"
                    srcSet="/after.png"
                    alt="Image two"
                    className="w-8 h-20"
                  />
                }
              />
            </div>
          </div>

          <div>
            <div className="p-4">
              <div
                className={`flex flex-col items-center mt-14 w-84 ${
                  dogImage || imagePreview ? "h-full" : "h-84"
                } rounded-2xl p-3 bg-black/40`}
              >
                {!loading && !dogImage && (
                  <div
                    className={`p-2 rounded-lg flex flex-col h-full justify-center items-center ${
                      imagePreview || dogImage ? "bg-black/30" : ""
                    }`}
                  >
                    <label
                      htmlFor="fileInput"
                      className="text-sm font-semibold text-center cursor-pointer"
                    >
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="fileInput"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files[0]) {
                          setImagePreview(
                            URL.createObjectURL(e.target.files[0])
                          );
                        }
                      }}
                    />
                  </div>
                )}

                {dogImage || imagePreview ? (
                  <div className="flex items-center justify-center h-full w-full">
                    {dogImage ? (
                      <img
                        src={dogImage}
                        alt="Dogified"
                        className="rounded-2xl w-xl max-h-72 object-contain"
                      />
                    ) : (
                      imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="rounded-2xl w-xl max-h-72 object-contain"
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>

            <div className="w-full flex flex-col items-center">
              {error && (
                <p className="text-red-500 text-xs text-center text-wrap justify-center font-semibold mb-3">
                  {error
                    .split(" ")
                    .reduce<React.ReactNode[]>((acc, word, idx, arr) => {
                      if ((idx + 1) % 6 === 0 && idx !== arr.length - 1) {
                        return [...acc, word, <br key={idx} />];
                      }
                      return [...acc, word, " "];
                    }, [] as React.ReactNode[])}
                </p>
              )}
              {loading ? (
                <OrbitProgress
                  color="#ffffff"
                  size="small"
                  text=""
                  style={{ width: "20px", height: "20px" }}
                />
              ) : (
                <div className="flex flex-row gap-x-2">
                  {dogImage ? (
                    <div className="flex flex-row gap-x-2">
                      <Button
                        text="COPY"
                        color="bg-[#404040]"
                        onClick={() => {
                          fetch(dogImage!)
                            .then((response) => response.blob())
                            .then((blob) => {
                              const item = new ClipboardItem({
                                [blob.type]: blob,
                              });
                              return navigator.clipboard.write([item]);
                            })
                            .catch((err) => {
                              console.error("Failed to copy image:", err);
                            });
                        }}
                      />
                      <Button
                        text="SAVE"
                        color="bg-[#404040]"
                        onClick={() => {
                          fetch(dogImage)
                            .then((response) => response.blob())
                            .then((blob) => {
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = "dogified.png";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            })
                            .catch((err) => {
                              console.error("Error saving image:", err);
                            });
                        }}
                      />
                      <Button
                        text="RESET"
                        color="bg-[#404040]"
                        onClick={() => {
                          setDogImage(null);
                          setImagePreview(null);
                          setError(null);
                          setLoading(false);

                          const fileInput = document.getElementById(
                            "fileInput"
                          ) as HTMLInputElement;
                          if (fileInput) {
                            fileInput.value = "";
                          }
                        }}
                      />
                    </div>
                  ) : (
                    imagePreview && (
                      <Button
                        text="DOGIFY"
                        color="bg-[#D93B3A]"
                        onClick={async () => {
                          setLoading(true);
                          setDogImage(null);

                          const { URL, Error } = await submitImage({
                            imagePath: imagePreview!,
                          });

                          if (URL) {
                            setDogImage(URL);
                            setError(null);
                          } else {
                            setError(Error!);
                          }

                          setLoading(false);
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 mt-16 flex flex-col items-center">
          <p className="text-xs font-semilight text-white text-center">
            <b>Fun Fact:</b> Studies show that dogs do well on dating profiles!
          </p>
        </div>

        <div className="-mt-2 flex flex-col items-center">
          <Button
            text={`View Disclaimer ${showDisclaimer ? "▲" : "▼"}`}
            style="px-5 py-2 font-semibold text-white rounded-2xl csshadow-lt cursor-pointer"
            onClick={() => {
              setShowDisclaimer(!showDisclaimer);
            }}
          />
          {showDisclaimer ? (
            <div className="p-4 -mt-2 flex flex-col items-center">
              <p className="text-xs font-semilight text-white text-center">
                This extension is for entertainment purposes only. You{" "}
                <i>should not</i> use fake dogs on dating profiles. You can
                improve your dating profile by using{" "}
                <a
                  className="text-blue-500 underline"
                  target="_blank"
                  href="https://yourmove.ai"
                >
                  YourMove.AI
                </a>
              </p>
            </div>
          ) : (
            <p className="text-xs mb-2">
              {/* Made by{" "}
                <a
                  className="text-blue-500 underline"
                  target="_blank"
                  href="https://yourmove.ai"
                >
                  YourMove.AI
                </a> */}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
