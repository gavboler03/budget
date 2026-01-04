"use client";

import AuthContext from "@/app/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useState } from "react";

export default function RegisterComponent() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { login } = context;

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/auth", {
        username: registerUsername,
        password: registerPassword,
      });
      login(registerUsername, registerPassword);
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };
  return (
    <div className="container">
      <h2 className="mt-5">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="registerUsername" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="registerUsername"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
        <Link href="/login">Login</Link>
      </form>
    </div>
  );
}
