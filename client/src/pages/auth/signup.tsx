import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import signupImage from "@/assets/signup.png";

const Signup = () => {
    const navigate = useNavigate();
    const { signup, isSigningUp } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const validate = () => {
        const newErrors = { email: "", password: "", confirmPassword: "" };
        let valid = true;

        if (!formData.email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            valid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await signup({ email: formData.email, password: formData.password });
            toast.success("Account created successfully!");
            navigate("/onboarding");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Left — image */}
            <div className="relative hidden lg:flex w-[60%]">
                <img
                    src={signupImage}
                    alt="signup"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-10 left-10 right-10">
                    {/* <p className="text-2xl font-bold text-cyan-400">Nod</p> */}
                    <h1 className="mt-4 text-5xl font-bold text-white leading-tight">
                        Enter the <span className="text-pink-400">Sanctuary</span> of Digital Connection.
                    </h1>
                    <p className="mt-4 text-gray-300 text-lg max-w-lg">
                        Engineered for privacy, styled for the night. Join the global network where every message is a masterpiece of clarity and security.
                    </p>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex flex-1 flex-col justify-center px-10 bg-[#0f0f0f] overflow-y-auto">
                <div className="mx-auto w-full max-w-md py-10">
                    <h2 className="text-4xl font-bold text-white">Create Account</h2>
                    <p className="mt-2 text-gray-400">Join Nod. Start your journey today.</p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs tracking-widest text-gray-400 uppercase">
                                Email Address
                            </Label>
                            <Input
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`bg-[#1a1a1a] border text-white placeholder:text-gray-600 ${
                                    errors.email
                                        ? "border-red-500 focus-visible:ring-red-500"
                                        : "border-gray-700"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
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

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs tracking-widest text-gray-400 uppercase">
                                Confirm Password
                            </Label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`bg-[#1a1a1a] border text-white placeholder:text-gray-600 ${
                                    errors.confirmPassword
                                        ? "border-red-500 focus-visible:ring-red-500"
                                        : "border-gray-700"
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-5 cursor-pointer"
                        >
                            {isSigningUp ? "Creating account..." : "Create Account →"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-700" />
                        <span className="text-xs tracking-widest text-gray-500 uppercase">
                            Continue with
                        </span>
                        <div className="h-px flex-1 bg-gray-700" />
                    </div>

                    {/* OAuth buttons — placeholders for now */}
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 bg-[#1a1a1a] border-gray-700 hover:bg-[#222] text-white cursor-pointer">
                            Google
                        </Button>
                        <Button variant="outline" className="flex-1 bg-[#1a1a1a] border-gray-700 hover:bg-[#222] text-white cursor-pointer">
                            GitHub
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-gray-500 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-violet-400 hover:underline">
                            Login
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

export default Signup;