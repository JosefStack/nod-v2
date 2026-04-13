import { useEffect, useState } from "react";


import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

import { toast } from "sonner";


import AccountSetupStep from "./steps/AccountSetupStep";
import TermsStep from "./steps/TermsStep";
import WelcomeStep from "./steps/WelcomeStep";
import FeaturesStep from "./steps/FeaturesStep";
import { useNavigate } from "react-router";

import {
    Check,
    User,
    FileText,
    Sparkles,
} from "lucide-react";
import { connectSocket } from "@/lib/socket";
import { useChatStore } from "@/store/useChatStore";


const STEPS: readonly string[] = ["Welcome", "Account Setup", "Terms", "Get Started"];
const stepIcons = { "Welcome": Sparkles, "Account Setup": User, "Terms": FileText, "Get Started": Sparkles };

const Onboarding = () => {

    const { user } = useAuthStore();

    useEffect(() => {
        if (user?.image) setFormData((prev) => ({ ...prev, avatarPreview: user.image as string }));
        if (user?.name) setFormData((prev) => ({ ...prev, fullName: user.name as string }))
    }, [])

    const { completeOnboarding, checkUsername } = useUserStore();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        bio: "",
        avatar: "",
        avatarPreview: "",
    });


    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            await completeOnboarding({
                username: formData.username,
                fullName: formData.fullName,
                bio: formData.bio,
                avatar: formData.avatar,
            });
            toast.success("Onboarding complete!");
            const socket = connectSocket();
            useChatStore.getState().initSocketListeners(socket);
            navigate("/");
        } catch (err: any) {
            toast.error(err.message || "Onboarding failed");
        } finally {
            setIsSubmitting(false);
        }
    }



    return (
        <div className="flex h-screen w-screen bg-[#0d0e11] overflow-hidden">
            <div className="fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

            <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[#121316] py-8 z-50">

                <div className="px-8 mb-12">
                    <h1 className="text-xl font-bold text-white tracking-tight">Nod</h1>
                    <p className="text-xs text-gray-500 mt-1">Step {currentStep + 1} of {STEPS.length}</p>
                </div>

                <nav className="flex-1 flex flex-col">

                    {STEPS.map((step, index) => {
                        const Icon = stepIcons[step as keyof typeof stepIcons];
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const isPending = index > currentStep;

                        return (
                            <div
                                key={step}
                                className={`
                                    flex items-center gap-3 px-6 py-4 text-sm font-bold tracking-wide transition-all duration-200
                                    ${isActive ? "text-white bg-[#24262a] border-l-2 border-l-violet-500" : ""}
                                    ${isCompleted ? "text-gray-400" : ""}
                                    ${isPending ? "text-gray-600" : ""}
                                `}
                            >
                                <div className="w-5 h-5 flex items-center justify-center">
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 text-green-500" strokeWidth={2.5} />
                                    ) : (
                                        <Icon
                                            className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-gray-600"}`}
                                            strokeWidth={1.5}
                                        />
                                    )}
                                </div>
                                <span className={
                                    isActive ? "text-white" : isCompleted ? "text-gray-400" : "text-gray-500"
                                }>
                                    {step}
                                </span>
                            </div>
                        );
                    })
                    };
                </nav>


            </aside>

            <main className="flex-1 flex flex-col overflow-y-auto">

                <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800/50">

                    {/* mobile */}
                    <div className="flex lg:hidden items-center gap-2">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    h-1 rounded-full transition-all duration-300
                                    ${i === currentStep ? "w-8 bg-violet-500" : ""}
                                    ${i < currentStep ? "w-4 bg-violet-500/50" : ""}
                                    ${i > currentStep ? "w-4 bg-gray-700" : ""}
                                `}
                            />
                        ))}
                    </div>
                    {/* mobile */}
                    <p className="text-xs text-gray-500 lg:hidden">
                        Step {currentStep + 1} of {STEPS.length}
                    </p>

                    {/* large */}
                    <div className="hidden lg:flex items-center gap-2 text-sm">
                        <span className="text-violet-400 font-bold uppercase tracking-widest">Onboarding</span>
                        <span className="text-gray-700">›</span>
                        <span className="text-gray-400">{STEPS[currentStep]}</span>
                    </div>



                </header>


                <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-6 lg:px-12 py-12">
                    {currentStep === 0 && <WelcomeStep onNext={handleNext} />}
                    {currentStep === 1 && (
                        <AccountSetupStep
                            formData={formData}
                            setFormData={setFormData}
                            usernameValidation={checkUsername}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 2 && <TermsStep onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 3 && (
                        <FeaturesStep
                            onComplete={handleComplete}
                            onBack={handleBack}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </main>
        </div>
    )

};



export default Onboarding;