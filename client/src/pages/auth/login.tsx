import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { GlobePanel } from "@/components/auth/GlobePanel";

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoggingIn, signInWithGithub, signInWithGoogle, user } = useAuthStore();

    const [formData, setFormData] = useState({
        input: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        input: "",
        password: "",
    });

    const validate = () => {
        const newErrors = { input: "", password: "" };
        let valid = true;

        if (!formData.input) {
            newErrors.input = "Email or username is required";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await login({ input: formData.input, password: formData.password });
            toast.success("Logged in successfully!");

            if (!user?.isOnboarded) {
                navigate("/onboarding");
            }

        } catch (err: any) {
            toast.error(err.response?.data?.message || err?.message || "Login failed");
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden">

            <GlobePanel
                heading={<>Welcome <span className="text-pink-400">Back</span> to Nod.</>}
                subtext="The night awaits. Pick up where you left off."
            />

            {/* RIGHT SIDE — form */}
            <div className="flex flex-1 flex-col justify-center px-10 overflow-y-auto" style={{ background: "#0d0d14" }}>
                <div className="mx-auto w-full max-w-md py-10">
                    <h2 className="text-4xl font-bold text-white">Welcome Back</h2>
                    <p className="mt-2 text-gray-400">Enter your credentials to continue.</p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

                        {/* EMAIL OR USERNAME */}
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs tracking-widest text-gray-400 uppercase">
                                Email or Username
                            </Label>
                            <Input
                                name="input"
                                type="text"
                                placeholder="name@example.com or username"
                                value={formData.input}
                                onChange={handleChange}
                                className={`bg-[#1a1a1a] border text-white placeholder:text-gray-600 ${
                                    errors.input
                                        ? "border-red-500 focus-visible:ring-red-500"
                                        : "border-gray-700"
                                }`}
                            />
                            {errors.input && (
                                <p className="text-red-500 text-sm">{errors.input}</p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs tracking-widest text-gray-400 uppercase">
                                Password
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className={`bg-[#1a1a1a] border text-white placeholder:text-gray-600 ${
                                    errors.password
                                        ? "border-red-500 focus-visible:ring-red-500"
                                        : "border-gray-700"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-5 cursor-pointer"
                        >
                            {isLoggingIn ? "Logging in..." : "Login →"}
                        </Button>
                    </form>

                    {/* DIVIDER */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-700" />
                        <span className="text-xs tracking-widest text-gray-500 uppercase">
                            Continue with
                        </span>
                        <div className="h-px flex-1 bg-gray-700" />
                    </div>

                    {/* OAUTH BUTTONS */}
                    <div className="flex gap-3">
                        <Button onClick={signInWithGoogle} variant="outline" className="flex-1 bg-[#1a1a1a] border-gray-700 hover:bg-[#222] text-white cursor-pointer">
                            Google
                        </Button>
                        <Button onClick={signInWithGithub} variant="outline" className="flex-1 bg-[#1a1a1a] border-gray-700 hover:bg-[#222] text-white cursor-pointer">
                            GitHub
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-violet-400 hover:underline">
                            Create one
                        </Link>
                    </p>

                    <div className="mt-8 flex justify-center gap-6 text-xs text-gray-600 uppercase tracking-widest">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;