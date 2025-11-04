import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";

const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            alert("Registration was successful!");
        } catch (err: any) {
          setError(err.message);
        }
    };

    return (
        <form onSubmit = {handleRegister}>
            <input
              type = "text"
              placeholder = "Full Name"
              value = {name}
              onChange = {(e) => setName(e.target.value)}
              required
            />
            <input
              type = "email"
              placeholder = "Email"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
              required
            />
            <input
              type = "password"
              placeholder = "Password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              required
            />
            <button type = "submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Register;