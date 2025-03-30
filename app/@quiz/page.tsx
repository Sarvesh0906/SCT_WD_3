"use client";

import { cn } from "@/lib/utils";
import { useQuizConfig } from "@/store";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Player } from "@lottiefiles/react-lottie-player";

function decodeHTML(html: any) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

type QuestionT = { 
  answers: string[], 
  category: string, 
  correct_answer: string, 
  incorrect_answers: string[], 
  difficulty: string, 
  type: string,
  question: string
};

export default function Quiz() {
  const [questions, setQuestions] = useState<QuestionT[] | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeStatus = useQuizConfig((state: any) => state.changeStatus);
  const config = useQuizConfig((state: any) => state.config);
  const setScore = useQuizConfig((state: any) => state.setScore);

  useEffect(() => {
    async function getQuestions() {
      if (!config.category.id || !config.level || !config.type || config.numberOfQuestion <= 0) {
        setError("Please fill in all fields correctly before starting the quiz.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://opentdb.com/api.php?amount=${config.numberOfQuestion}&category=${config.category.id}&difficulty=${config.level}&type=${config.type}`
        );
        const { results } = await res.json();

        console.log("Fetched Questions:", results);

        let processedResults = results.map((q: QuestionT) => {
          let answers = q.type === "boolean"
            ? ["True", "False"]
            : [...q.incorrect_answers, q.correct_answer]
                .map((value) => ({ value: decodeHTML(value), sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
          
          return { ...q, question: decodeHTML(q.question), answers };
        });

        setQuestions(processedResults);
      } catch (error) {
        // setError("Failed to fetch questions. Please try again.");
      }
      setLoading(false);
    }
    getQuestions();
  }, [config.category, config.level, config.numberOfQuestion, config.type]);

  const answerCheck = (ans: string) => {
    if (questions && ans === questions[0].correct_answer) {
      setScore();
    }
    setAnswer(questions ? questions[0].correct_answer : "");
  };

  const handleNext = () => {
    if (questions) {
      let remainingQuestions = [...questions];
      remainingQuestions.shift();
      setQuestions(remainingQuestions);
      setAnswer("");
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      {error && <p className="text-red-500 text-lg font-bold">{error}</p>}
      {questions?.length ? (
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl dark:text-white">
          Question No {" "}
          <span className="text-blue-600 dark:text-blue-500">
            #{config.numberOfQuestion - questions.length + 1}
          </span>
          .
        </h1>
      ) : null}
      {loading && (
        <div className="flex flex-col">
          <Skeleton className="w-[600px] h-[60px] my-10 rounded-sm" />
          <Skeleton className="w-[600px] h-[500px] rounded-sm" />
        </div>
      )}

      {!loading && !!questions?.length && (
        <p className="text-2xl text-white">Score: {config.score}</p>
      )}

      {!questions?.length && !loading && (
        <div className="flex flex-col justify-center items-center">
          <Player
            src="https://assets6.lottiefiles.com/packages/lf20_touohxv0.json"
            className="player"
            loop
            autoplay
            style={{ height: "400px", width: "400px" }}
          />

          <h1 className="mt-10 text-center font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            YOUR SCORE : {" "}
            <span className="font-extrabold text-transparent text-10xl bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {config.score}
            </span>
          </h1>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-white hover:bg-gray-100 my-10 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
          >
            Start Over
          </button>
        </div>
      )}

      {!!questions && !!questions?.length && (
        <section className="shadow-lg my-10 p-10 w-[80%] rounded-lg flex flex-col justify-center items-center shadow-blue-200 bg-gray-400 ">
          <h4 className="mb-4 text-center text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-4xl  text-blue-600 dark:text-blue-500">
            {questions[0].question}
          </h4>

          <div className="flex justify-evenly items-center w-full my-8 flex-wrap">
            {questions[0].answers.map((e: string, index: number) => (
              <button
                key={`${e}-${index}`}
                onClick={() => answerCheck(e)}
                className={cn(
                  "w-[40%] my-4 bg-white hover:bg-blue-600 hover:text-gray-100 text-gray-800 font-semibold py-4 px-4 shadow-blue-200 rounded-lg shadow-2xl",
                  {
                    "bg-blue-600": !!answer && answer === e,
                    "bg-red-600": !!answer && answer !== e,
                    "text-gray-200": !!answer,
                  }
                )}
              >
                {e}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
          >
            Next
          </button>
        </section>
      )}
    </section>
  );
}
