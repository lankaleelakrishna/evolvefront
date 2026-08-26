import React, { useEffect, useRef, useState } from "react";
import "./MockInterview.css";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaVideo,
    FaStop,
    FaRobot,
    FaArrowRight,
    FaMicrophone,
} from "react-icons/fa";
import NavBar from "../HomePage/NavBar/NavBar";
import Footer from "../Footer/Footer";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const MAX_INTRO_TIME = 120;
const MAX_ANSWER_TIME = 60;
const FACE_WARNING_LIMIT = 8;

const MockInterview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const introRecorderRef = useRef(null);
    const introChunksRef = useRef([]);
    const introTimerRef = useRef(null);
    const introStreamRef = useRef(null);
    const cameraRef = useRef(null);
    const faceMeshRef = useRef(null);
    const isIntroRecordingRef = useRef(false);
    const faceWarningCountRef = useRef(0);

    const answerRecorderRef = useRef(null);
    const answerChunksRef = useRef([]);
    const answerTimerRef = useRef(null);
    const currentAudioBlobRef = useRef(null);

    const [job, setJob] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [session, setSession] = useState(null);
    const [loadingJob, setLoadingJob] = useState(true);
    const [jobError, setJobError] = useState("");
    const [step, setStep] = useState("instructions");
    const [introSeconds, setIntroSeconds] = useState(0);
    const [isIntroRecording, setIsIntroRecording] = useState(false);
    const [introVideoUrl, setIntroVideoUrl] = useState(null);
    const [canSubmitIntro, setCanSubmitIntro] = useState(false);
    const [faceError, setFaceError] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isAnswerRecording, setIsAnswerRecording] = useState(false);
    const [answerSeconds, setAnswerSeconds] = useState(0);
    const [answerAudioUrl, setAnswerAudioUrl] = useState(null);
    const [submittingAnswer, setSubmittingAnswer] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        return () => {
            clearInterval(introTimerRef.current);
            clearInterval(answerTimerRef.current);
            cleanupFaceMesh();

            if (faceMeshRef.current) {
                faceMeshRef.current.close();
                faceMeshRef.current = null;
            }

            if (introStreamRef.current) {
                introStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (introSeconds >= MAX_INTRO_TIME && isIntroRecording) {
            stopIntroRecording();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [introSeconds, isIntroRecording]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
        };
    };

    const calculateAverageScore = (answerList = answers) => {
        if (!answerList || answerList.length === 0) {
            return 0;
        }

        const total = answerList.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
        );

        const average = total / answerList.length;
        return Math.min(Math.round(average), 100);
    };

    const fetchJobDetails = async () => {
        try {
            setLoadingJob(true);
            setJobError("");

            const response = await fetch(`http://localhost:8080/api/aftergrad/${id}`);

            if (!response.ok) throw new Error("Failed to fetch job details");

            const data = await response.json();

            const mappedJob = {
                id: data.id,
                title: data.jobTitle || data.title || "Job Title",
                company: data.compName || data.companyName || data.company || "Company",
                location: data.location || "Location not available",
                salary: data.salary || "Not disclosed",
                type: data.jobType || data.type || "Full Time",
                description:
                    data.jobDescription ||
                    data.description ||
                    "Job description not available.",
                skills: data.reqSkills ? data.reqSkills.split(",") : [],
                userId: data.userId,
            };

            setJob(mappedJob);
            await fetchQuestions(mappedJob.id);
        } catch (error) {
            console.error("Job fetch error:", error);
            setJobError("Unable to load job details.");
        } finally {
            setLoadingJob(false);
        }
    };

    const fetchQuestions = async (jobId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/questions/job/${jobId}`,
                {
                    method: "GET",
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch questions");

            const data = await response.json();

            const validQuestions = Array.isArray(data)
                ? data.filter((q) => q && q.id && (q.question || q.questionText || q.title))
                : [];

            setQuestions(validQuestions);
        } catch (error) {
            console.error("Questions fetch error:", error);
            setQuestions([]);
        }
    };

    const startInterviewSession = async () => {
        try {
            const candidateId =
                localStorage.getItem("candidateProfileId") ||
                localStorage.getItem("userId");

            if (!candidateId) {
                alert("Candidate login required.");
                navigate("/login/candidate");
                return;
            }

            if (!questions || questions.length === 0) {
                alert("No AI questions found for this job. Please generate questions from backend first.");
                return;
            }

            const response = await fetch(
                `http://localhost:8080/api/interview-session/start?candidateId=${candidateId}&jobId=${job.id}`,
                {
                    method: "POST",
                    headers: {
                        ...getAuthHeaders(),
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to start interview session");

            const data = await response.json();
            setSession(data);
            setStep("intro");
        } catch (error) {
            console.error("Session start error:", error);
            alert("Unable to start interview session.");
        }
    };

    const getQuestionText = (question) => {
        return (
            question?.question ||
            question?.questionText ||
            question?.title ||
            "Interview question not available."
        );
    };

    const interviewQuestions = questions;

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, "0");
        const sec = String(seconds % 60).padStart(2, "0");
        return `${min}:${sec}`;
    };

    const cleanupFaceMesh = () => {
        try {
            if (cameraRef.current) {
                cameraRef.current.stop();
                cameraRef.current = null;
            }
        } catch (error) {
            console.log("FaceMesh cleanup error:", error);
        }
    };

    const stopRecordingForFaceError = (message) => {
        setFaceError(message);

        if (
            introRecorderRef.current &&
            introRecorderRef.current.state !== "inactive"
        ) {
            introRecorderRef.current.stop();
        }

        clearInterval(introTimerRef.current);
        cleanupFaceMesh();

        setIsIntroRecording(false);
        isIntroRecordingRef.current = false;
        setCanSubmitIntro(false);

        if (introStreamRef.current) {
            introStreamRef.current.getTracks().forEach((track) => track.stop());
            introStreamRef.current = null;
        }
    };

    const initializeFaceMesh = () => {
        const faceMesh = new FaceMesh({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
        });

        faceMesh.onResults((results) => {
            if (!isIntroRecordingRef.current) return;

            if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
                faceWarningCountRef.current += 1;

                if (faceWarningCountRef.current >= FACE_WARNING_LIMIT) {
                    stopRecordingForFaceError(
                        "Face not detected. Please look straight into the camera."
                    );
                }

                return;
            }

            const landmarks = results.multiFaceLandmarks[0];

            const nose = landmarks[1];
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            const chin = landmarks[152];
            const forehead = landmarks[10];

            const leftEyeOuter = landmarks[33];
            const leftEyeInner = landmarks[133];
            const rightEyeInner = landmarks[362];
            const rightEyeOuter = landmarks[263];
            const leftIris = landmarks[468];
            const rightIris = landmarks[473];

            if (
                !nose ||
                !leftCheek ||
                !rightCheek ||
                !chin ||
                !forehead ||
                !leftEyeOuter ||
                !leftEyeInner ||
                !rightEyeInner ||
                !rightEyeOuter ||
                !leftIris ||
                !rightIris
            ) {
                return;
            }

            const leftDistance = Math.abs(nose.x - leftCheek.x);
            const rightDistance = Math.abs(rightCheek.x - nose.x);
            const faceHeight = Math.abs(chin.y - forehead.y);
            const turnRatio = leftDistance / rightDistance;

            const turnedLeftOrRight = turnRatio > 1.8 || turnRatio < 0.55;
            const faceTooLowOrHigh = nose.y < 0.28 || nose.y > 0.72;
            const faceTooSmall = faceHeight < 0.25;
            const faceNotCentered = nose.x < 0.34 || nose.x > 0.66;

            const getEyeRatio = (iris, corner1, corner2) => {
                const minX = Math.min(corner1.x, corner2.x);
                const maxX = Math.max(corner1.x, corner2.x);

                if (maxX - minX === 0) return 0.5;

                return (iris.x - minX) / (maxX - minX);
            };

            const leftEyeRatio = getEyeRatio(leftIris, leftEyeOuter, leftEyeInner);
            const rightEyeRatio = getEyeRatio(rightIris, rightEyeInner, rightEyeOuter);
            const averageEyeRatio = (leftEyeRatio + rightEyeRatio) / 2;

            const eyesTurnedLeftOrRight =
                averageEyeRatio < 0.32 || averageEyeRatio > 0.68;

            if (
                turnedLeftOrRight ||
                faceTooLowOrHigh ||
                faceTooSmall ||
                faceNotCentered ||
                eyesTurnedLeftOrRight
            ) {
                faceWarningCountRef.current += 1;
            } else {
                faceWarningCountRef.current = 0;
                setFaceError("");
            }

            if (faceWarningCountRef.current >= FACE_WARNING_LIMIT) {
                stopRecordingForFaceError(
                    "Please maintain eye contact with the camera. Recording stopped because you turned your head or eyes away."
                );
            }
        });

        faceMeshRef.current = faceMesh;
    };

    const startIntroRecording = async () => {
        try {
            setFaceError("");
            faceWarningCountRef.current = 0;
            setCanSubmitIntro(false);
            setIntroVideoUrl(null);

            if (!videoRef.current) {
                alert("Camera preview not ready.");
                return;
            }

            cleanupFaceMesh();

            if (!faceMeshRef.current) {
                initializeFaceMesh();
            }

            cameraRef.current = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (
                        faceMeshRef.current &&
                        videoRef.current &&
                        isIntroRecordingRef.current
                    ) {
                        await faceMeshRef.current.send({ image: videoRef.current });
                    }
                },
                width: 640,
                height: 480,
            });

            await cameraRef.current.start();

            const videoStream = videoRef.current.srcObject;

            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);

            introStreamRef.current = combinedStream;
            introChunksRef.current = [];

            const recorder = new MediaRecorder(combinedStream);
            introRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) introChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(introChunksRef.current, { type: "video/webm" });
                const videoUrl = URL.createObjectURL(blob);
                setIntroVideoUrl(videoUrl);

                if (!faceError && introChunksRef.current.length > 0) {
                    setCanSubmitIntro(true);
                }
            };

            recorder.start();

            setIsIntroRecording(true);
            isIntroRecordingRef.current = true;
            setIntroSeconds(0);

            clearInterval(introTimerRef.current);

            introTimerRef.current = setInterval(() => {
                setIntroSeconds((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            cleanupFaceMesh();
            alert("Please allow camera and microphone permission.");
            console.error(error);
        }
    };

    const stopIntroRecording = () => {
        if (
            introRecorderRef.current &&
            introRecorderRef.current.state !== "inactive"
        ) {
            introRecorderRef.current.stop();
        }

        clearInterval(introTimerRef.current);

        setIsIntroRecording(false);
        isIntroRecordingRef.current = false;

        cleanupFaceMesh();

        if (introStreamRef.current) {
            introStreamRef.current.getTracks().forEach((track) => track.stop());
            introStreamRef.current = null;
        }
    };

    const submitIntro = () => {
        if (faceError) {
            alert("Please record again with proper eye contact.");
            return;
        }

        if (!canSubmitIntro || !introVideoUrl) {
            alert("Please record your self introduction first.");
            return;
        }

        if (!interviewQuestions || interviewQuestions.length === 0) {
            alert("No AI questions available. Please try again.");
            return;
        }

        setStep("interview");
    };

    const startAnswerRecording = async () => {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            answerChunksRef.current = [];
            currentAudioBlobRef.current = null;
            setAnswerAudioUrl(null);
            setAnswerSeconds(0);

            const recorder = new MediaRecorder(audioStream);
            answerRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) answerChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(answerChunksRef.current, {
                    type: "audio/webm",
                });
                currentAudioBlobRef.current = blob;
                const audioUrl = URL.createObjectURL(blob);
                setAnswerAudioUrl(audioUrl);
                audioStream.getTracks().forEach((track) => track.stop());
            };

            recorder.start();
            setIsAnswerRecording(true);

            clearInterval(answerTimerRef.current);

            answerTimerRef.current = setInterval(() => {
                setAnswerSeconds((prev) => {
                    if (prev + 1 >= MAX_ANSWER_TIME) {
                        clearInterval(answerTimerRef.current);
                        stopAnswerRecording();
                        return MAX_ANSWER_TIME;
                    }

                    return prev + 1;
                });
            }, 1000);
        } catch (error) {
            alert("Please allow microphone permission.");
            console.error(error);
        }
    };

    const stopAnswerRecording = () => {
        if (
            answerRecorderRef.current &&
            answerRecorderRef.current.state !== "inactive"
        ) {
            answerRecorderRef.current.stop();
        }

        clearInterval(answerTimerRef.current);
        setIsAnswerRecording(false);
    };

    const submitVoiceAnswer = async () => {
        try {
            if (!answerAudioUrl || !currentAudioBlobRef.current) {
                alert("Please record your answer first.");
                return;
            }

            if (!session?.id) {
                alert("Interview session not found.");
                return;
            }

            const currentQuestion = interviewQuestions[currentQuestionIndex];

            if (!currentQuestion?.id) {
                alert("Invalid question id. Please reload questions from backend.");
                return;
            }

            setSubmittingAnswer(true);

            const formData = new FormData();
            formData.append("sessionId", session.id);
            formData.append("questionId", currentQuestion.id);
            formData.append("answerDuration", answerSeconds);
            formData.append(
                "audioFile",
                currentAudioBlobRef.current,
                `answer-question-${currentQuestion.id}.webm`
            );

            const response = await fetch(`http://localhost:8080/api/answers/submit`, {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to submit answer");

            const savedAnswer = await response.json();

            const newAnswer = {
                id: savedAnswer.id,
                question: getQuestionText(currentQuestion),
                questionId: currentQuestion.id,
                audioUrl: answerAudioUrl,
                feedback:
                    savedAnswer.feedback ||
                    "Voice answer submitted successfully.",
                score: savedAnswer.score || 0,
                transcribedText: savedAnswer.transcribedText || "",
            };

            const updatedAnswers = [...answers, newAnswer];

            setAnswers(updatedAnswers);
            setAnswerAudioUrl(null);
            setAnswerSeconds(0);
            currentAudioBlobRef.current = null;

            if (currentQuestionIndex < interviewQuestions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                await completeInterview(updatedAnswers);
                setStep("report");
            }
        } catch (error) {
            console.error("Answer submit error:", error);
            alert("Failed to submit answer.");
        } finally {
            setSubmittingAnswer(false);
        }
    };

    const completeInterview = async (finalAnswers = answers) => {
        try {
            const totalScore = calculateAverageScore(finalAnswers);
            const feedback = "Interview completed successfully.";

            await fetch(
                `http://localhost:8080/api/interview-session/complete/${session.id}?totalScore=${totalScore}&feedback=${encodeURIComponent(
                    feedback
                )}`,
                {
                    method: "PUT",
                    headers: {
                        ...getAuthHeaders(),
                    },
                }
            );

            const resultFormData = new FormData();
            resultFormData.append("sessionId", session.id);
            resultFormData.append("technicalScore", totalScore);
            resultFormData.append("communicationScore", totalScore);
            resultFormData.append("confidenceScore", totalScore);
            resultFormData.append("overallScore", totalScore);
            resultFormData.append(
                "strengths",
                "Based on AI evaluation of the submitted voice answers."
            );
            resultFormData.append(
                "weakness",
                "Review individual feedback and improve answer structure."
            );
            resultFormData.append(
                "feedback",
                "Candidate completed the mock interview successfully."
            );
            resultFormData.append(
                "recommendation",
                "Practice with more job-specific questions."
            );

            await fetch(`http://localhost:8080/api/results/save`, {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                },
                body: resultFormData,
            });
        } catch (error) {
            console.error("Complete interview error:", error);
        }
    };

    if (loadingJob) {
        return (
            <>
                <NavBar />
                <div className="mockInterviewPage">
                    <div className="mockEmptyCard">
                        <h2>Loading job details...</h2>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (jobError || !job) {
        return (
            <>
                <NavBar />
                <div className="mockInterviewPage">
                    <div className="mockEmptyCard">
                        <h2>{jobError || "Job not found"}</h2>
                        <button onClick={() => navigate("/jobs")}>Back to Jobs</button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar />

            <div className="mockInterviewPage">
                <div className="mockInterviewHeader">
                    <div>
                        <h1>AI Mock Interview</h1>
                        <p>
                            Practice interview for <b>{job.title}</b> at{" "}
                            <b>{job.company}</b>
                        </p>
                    </div>

                    <button onClick={() => navigate(-1)} className="mockBackBtn">
                        Back
                    </button>
                </div>

                {step === "instructions" && (
                    <div className="mockCard">
                        <div className="mockIconCircle">
                            <FaRobot />
                        </div>

                        <h2>Interview Instructions</h2>

                        <div className="mockInstructionsGrid">
                            <div>
                                <h3>Self Introduction</h3>
                                <p>
                                    Candidate can stop recording anytime. Maximum
                                    self introduction duration is 2 minutes.
                                </p>
                            </div>

                            <div>
                                <h3>Eye Contact</h3>
                                <p>
                                    Candidate must face the camera straight and
                                    maintain eye contact. If candidate turns head or
                                    eyes away, recording will stop.
                                </p>
                            </div>

                            <div>
                                <h3>Voice Answers</h3>
                                <p>
                                    Every answer should be below 1 minute. Recording
                                    stops automatically at 1 minute.
                                </p>
                            </div>
                        </div>

                        <button
                            className="mockPrimaryBtn"
                            onClick={startInterviewSession}
                        >
                            Start Self Introduction <FaArrowRight />
                        </button>
                    </div>
                )}

                {step === "intro" && (
                    <div className="mockCard">
                        <h2>Self Introduction Round</h2>

                        <p className="mockSubText">
                            Keep your face straight and maintain eye contact
                            with the camera while recording.
                        </p>

                        {faceError && <p className="mockWarning">{faceError}</p>}

                        <div className="mockVideoBox">
                            {!introVideoUrl ? (
                                <video ref={videoRef} autoPlay muted playsInline />
                            ) : (
                                <video src={introVideoUrl} controls />
                            )}
                        </div>

                        <div className="mockTimer">
                            {formatTime(introSeconds)} / 02:00
                        </div>

                        <div className="mockButtonGroup">
                            {!isIntroRecording && !introVideoUrl && (
                                <button
                                    className="mockPrimaryBtn"
                                    onClick={startIntroRecording}
                                >
                                    <FaVideo /> Start Recording
                                </button>
                            )}

                            {isIntroRecording && (
                                <button
                                    className="mockDangerBtn"
                                    onClick={stopIntroRecording}
                                >
                                    <FaStop /> Stop Recording
                                </button>
                            )}

                            {introVideoUrl && (
                                <>
                                    {faceError && (
                                        <button
                                            className="mockOutlineBtn"
                                            onClick={() => {
                                                setIntroVideoUrl(null);
                                                setIntroSeconds(0);
                                                setCanSubmitIntro(false);
                                                setFaceError("");
                                                cleanupFaceMesh();
                                            }}
                                        >
                                            Record Again
                                        </button>
                                    )}

                                    {!faceError && (
                                        <button
                                            className={
                                                canSubmitIntro
                                                    ? "mockPrimaryBtn"
                                                    : "mockDisabledBtn"
                                            }
                                            onClick={submitIntro}
                                            disabled={!canSubmitIntro}
                                        >
                                            Continue to Interview
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {!introVideoUrl && !isIntroRecording && !faceError && (
                            <p className="mockWarning">
                                Start recording your self introduction to continue.
                            </p>
                        )}
                    </div>
                )}

                {step === "interview" && (
                    <div className="mockInterviewGrid">
                        <div className="mockJobPanel">
                            <h3>Job Description</h3>
                            <h4>{job.title}</h4>
                            <p>{job.company}</p>
                            <p>{job.location}</p>
                            <p>{job.description}</p>
                        </div>

                        <div className="mockQuestionPanel">
                            <span className="mockQuestionCount">
                                Question {currentQuestionIndex + 1} of{" "}
                                {interviewQuestions.length}
                            </span>

                            <h2>
                                {getQuestionText(
                                    interviewQuestions[currentQuestionIndex]
                                )}
                            </h2>

                            <div className="mockVoiceAnswerBox">
                                <div className="mockMicCircle">
                                    <FaMicrophone />
                                </div>

                                <p>Record your voice answer below 1 minute.</p>

                                <div className="mockTimer">
                                    {formatTime(answerSeconds)} / 01:00
                                </div>

                                {!isAnswerRecording && !answerAudioUrl && (
                                    <button
                                        className="mockPrimaryBtn"
                                        onClick={startAnswerRecording}
                                    >
                                        <FaMicrophone /> Start Voice Answer
                                    </button>
                                )}

                                {isAnswerRecording && (
                                    <button
                                        className="mockDangerBtn"
                                        onClick={stopAnswerRecording}
                                    >
                                        <FaStop /> Stop Recording
                                    </button>
                                )}

                                {answerAudioUrl && (
                                    <>
                                        <audio
                                            controls
                                            src={answerAudioUrl}
                                            className="mockAudioPlayer"
                                        />

                                        <div className="mockButtonGroup">
                                            <button
                                                className="mockPrimaryBtn"
                                                onClick={submitVoiceAnswer}
                                                disabled={submittingAnswer}
                                            >
                                                {submittingAnswer
                                                    ? "Submitting..."
                                                    : "Submit Voice Answer"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === "report" && (
                    <div className="mockCard">
                        <h2>Interview Report</h2>

                        <p className="mockSubText">
                            Your mock interview has been completed successfully.
                        </p>

                        <div className="mockScoreCard">
                            <h1>{calculateAverageScore()}%</h1>
                            <p>Overall Performance Score</p>
                        </div>

                        <div className="mockReportList">
                            {answers.map((item, index) => (
                                <div className="mockReportItem" key={index}>
                                    <h3>
                                        Q{index + 1}. {item.question}
                                    </h3>

                                    <audio
                                        controls
                                        src={item.audioUrl}
                                        className="mockAudioPlayer"
                                    />

                                    {item.transcribedText && (
                                        <p>
                                            <b>Transcribed Answer:</b>{" "}
                                            {item.transcribedText}
                                        </p>
                                    )}

                                    <p>
                                        <b>AI Score:</b> {item.score || 0}/10
                                    </p>

                                    <p>
                                        <b>Feedback:</b> {item.feedback}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            className="mockPrimaryBtn"
                            onClick={() => navigate("/jobs")}
                        >
                            Back to Jobs
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default MockInterview;