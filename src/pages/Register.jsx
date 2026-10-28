import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";

function Register(){
    const [fullName,setFullName] = useState("");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const {loading,error} = useSelector((state)=>state.auth);
    const [validationError,setValidationError] = useState("");
    const navigate = useNavigate();
 
const handleSubmit = async (event)=>{
    event.preventDefault();

    setValidationError("");

    if(!fullName.trim()){
        setValidationError("Full name is required");
        return;
    }
    if(!username.trim()){
        setValidationError("Username is required");
        return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
        setValidationError(
            "Username can only contain letters, numbers, and underscores"
        );
        return;
    }
    if(!email.trim()){
        setValidationError("Email is required");
        return;
    }
    if (!email.includes("@") || !email.includes(".")) {
    setValidationError("Please enter a valid email address");
    return;
    }
    if(password.length < 8){
        setValidationError("Password must be at least 8 characters")
        return;
    }
    if(!confirmPassword){
        setValidationError("Please confirm your password");
        return;
    }
    if(password !== confirmPassword){
        setValidationError("Passwords do not match");
        return;
    }

    const userData ={
        fullName:fullName,
        username:username,
        email:email,
        password:password,
        confirmPassword:confirmPassword
    };
    const result = await dispatch(registerUser(userData));
    if(registerUser.fulfilled.match(result)){
        navigate("/login");
    }
};
    return(
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-4 sm:py-6">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7">
          <div className="mb-5 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">TravelVerse</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">Sign up to start planning your next journey.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={fullName}
              onChange={(event)=>setFullName(event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
              <input type="text" placeholder="Enter your username"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={username}
              onChange={(event)=>setUsername(event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={email}
              onChange={(event)=>setEmail(event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={password}
              onChange={(event)=>setPassword(event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm Password</label>
              <input type="password" placeholder="Confirm your password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={confirmPassword}
              onChange={(event)=>setConfirmPassword(event.target.value)} />
            </div>

            {validationError && <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{validationError}</p>}
            {error && <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
            <div className="pt-1">
              <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-slate-800 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-700/20 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
<p className="mt-6 text-center text-sm text-slate-500">
    Already have an account?{" "}
    <button
        type="button"
        onClick={() => navigate("/login")}
        className="font-semibold text-blue-700 hover:text-blue-800"
    >
        Login
    </button>
</p>
        </section>
      </main>
    )
}
export default Register;