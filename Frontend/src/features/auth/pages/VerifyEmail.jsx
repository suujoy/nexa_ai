import { useEffect } from "react";
import { useSearchParams } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const VerifyEmail = () => {
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get("token");

        fetch(`${BASE_URL}/api/auth/verify-email?token=${token}`)
            .then((res) => res.text())
            .then((html) => {
                document.open();
                document.write(html);
                document.close();
            });
    }, []);

    return <p>Verifying...</p>;
};

export default VerifyEmail;
