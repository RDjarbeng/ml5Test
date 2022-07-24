import ml5 from "ml5";
import React from "react";
import { useEffect, useState } from "react";

export default function ObjectDetection() {
  const [text, setText] = useState("Loading");
  const [result, setResult] = useState("Loading");
  let res = "";
  let lasttime = -1;
  let i = 0;
  useEffect(() => {
    const predict = async () => {
      const video = document.getElementById("video");

      // set up the live video feed from the webcam
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();
          // Create an object detector using the CocoSSD model
          const objectDetector = ml5.objectDetector("cocossd", {}, () => {
            console.log("Model Loaded!");
          });
          let time = video.currentTime;

          console.log("Video time", time);
          lasttime = time;
          function detect() {
            // Detect objects in the video element
            objectDetector.detect(video, (err, results) => {
              console.log(results, "detecting");
              console.log("count", i++);
              if (results && results.length > 0) {
                setResult(results[0]);
                setText(
                  "Label: " +
                    results[0].label +
                    " Confidence: " +
                    results[0].confidence +
                    " " +
                    " X coords: " +
                    results[0].x +
                    " " +
                    " Y coords: " +
                    results[0].y +
                    " " +
                    " Width: " +
                    results[0].width +
                    " " +
                    " Height: " +
                    results[0].height
                );
              } else {
                console.log("No detections");
                setText("None to detect");
              }
              // results will be an array with predictions
            });
          }
          setInterval(detect, 2000);

          // requestAnimationFrame(predict);
        })
        .catch(function (err) {
          console.log("An error occurred: " + err);
        });
    };
    predict();
  }, []);

  return (
    <>
      <div>{text}</div>
      <video id="video" style={{ height: 400, width: 400 }}></video>
    </>
  );
}
