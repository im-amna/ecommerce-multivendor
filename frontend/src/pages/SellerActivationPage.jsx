
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!activation_token) {
      setError("Activation token is missing.");
      setLoading(false);
      return;
    }

    const activateSeller = async () => {
      try {
        const response = await axios.post(`${server}/shop/activation`, {
          activation_token,
        });

        console.log("ACTIVATION SUCCESS:", response.data);

        setSuccess(true);
        setError("");
        setLoading(false);

        // Seller token backend se cookie mein set ho chuka hoga.
        // Thori der baad seller dashboard par bhej dein.
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (err) {
        console.error(
          "ACTIVATION ERROR:",
          err.response?.data || err.message
        );

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to activate your shop.";

        setError(message);
        setSuccess(false);
        setLoading(false);
      }
    };

    activateSeller();
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
        gap: "15px",
      }}
    >
      {loading && <p>Activating your shop...</p>}

      {!loading && success && (
        <>
          <h2>Shop Activated Successfully! 🎉</h2>
          <p>Your seller account has been created successfully.</p>
          <p>Redirecting to dashboard...</p>
        </>
      )}

      {!loading && error && (
        <>
          <h2>Shop Activation Failed</h2>
          <p>{error}</p>
          <p>
            If your activation link has expired, please create a new seller
            account and use the latest activation email.
          </p>
        </>
      )}
    </div>
  );
};

export default SellerActivationPage;
