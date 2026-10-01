
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activation_token) {
      setError("Activation token is missing.");
      setLoading(false);
      return;
    }

    const activateUser = async () => {
      try {
        const res = await axios.post(
          `${server}/user/activation`,
          {
            activation_token,
          }
        );

        console.log("ACTIVATION SUCCESS:", res.data);

        setLoading(false);

        // Redirect to home after successful activation
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.log("ACTIVATION ERROR:", err);
        console.log(
          "ACTIVATION ERROR DATA:",
          err.response?.data
        );

        setLoading(false);

        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Activation failed."
        );
      }
    };

    activateUser();
  }, [activation_token, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <p>Activating your account...</p>
      ) : error ? (
        <div style={{ textAlign: "center" }}>
          <h2>Activation Failed</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2>Account Activated Successfully! 🎉</h2>
          <p>Redirecting you to the home page...</p>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
