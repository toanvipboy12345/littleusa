

// export default ForgotPassword;
import React, { useState, useEffect } from "react";
import axiosInstance from "../../Api/axiosInstance";
import {
  Box,
  Button,
  Input,
  Text,
  useToast,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  Stepper,
  StepSeparator,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink

const ForgotPassword = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // Bước: 1 (Nhập email), 2 (Xác thực OTP), 3 (Nhập mật khẩu mới), 4 (Thành công)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Đếm ngược 30 giây
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Hiệu ứng đếm ngược
  useEffect(() => {
    if (resendTimer > 0 && otpSent) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, otpSent]);

  // Gửi OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/forgot-password", { email });
      if (response.status === 200) {
        setOtpSent(true);
        setStep(2); // Chuyển sang bước xác thực OTP
        setResendTimer(30); // Reset đếm ngược
        toast({
          title: "OTP đã được gửi.",
          description: "Vui lòng kiểm tra email của bạn.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      }
    } catch (err) {
      setError(err.response?.data || "Không thể gửi OTP.");
    }
    setLoading(false);
  };

  // Xác thực OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/verify-otp", { email, otp });
      if (response.status === 200) {
        setStep(3); // Chuyển sang bước nhập mật khẩu mới
      }
    } catch (err) {
      setError(err.response?.data || "OTP không hợp lệ hoặc đã hết hạn.");
    }
    setLoading(false);
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.status === 200) {
        setStep(4); // Chuyển sang bước thành công
        toast({
          title: "Mật khẩu đã được đặt lại.",
          description: "Bạn có thể đăng nhập ngay bây giờ.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      }
    } catch (err) {
      setError(err.response?.data || "Không thể đặt lại mật khẩu.");
    }
    setLoading(false);
  };

  // Render từng bước
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Quên Mật Khẩu
            </Text>
            <Text mb="4">Vui lòng nhập email của bạn để nhận OTP.</Text>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="#f7f7f7"
              border="2px solid var(--primary-color)"
              color="black"
              borderRadius="0"
              px="4"
              _hover={{
                boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
              }}
              _focus={{
                borderColor: "var(--primary-color)",
              }}
              mb="3"
            />
            {error && <Text color="red">{error}</Text>}
            <Button
              onClick={handleSendOtp}
              isLoading={loading}
              bg="var(--primary-color)"
              color="white"
              _hover={{
                bg: "var(--hover-color)",
              }}
            >
              Gửi OTP
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Xác Thực OTP
            </Text>
            <Text mb="4">Mã OTP đã được gửi đến email của bạn.</Text>
            <Input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              bg="#f7f7f7"
              border="2px solid var(--primary-color)"
              color="black"
              borderRadius="0"
              px="4"
              _hover={{
                boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
              }}
              _focus={{
                borderColor: "var(--primary-color)",
              }}
              mb="3"
            />
            {error && <Text color="red">{error}</Text>}
            <Button
              onClick={handleVerifyOtp}
              isLoading={loading}
              bg="var(--primary-color)"
              color="white"
              _hover={{
                bg: "var(--hover-color)",
              }}
            >
              Xác thực OTP
            </Button>
            <Text mt="3">
              Gửi lại OTP trong{" "}
              <Text as="span" fontWeight="bold">
                {resendTimer}s
              </Text>
            </Text>
            {resendTimer === 0 && (
              <Button
                onClick={handleSendOtp}
                bg="var(--primary-color)"
                color="white"
                _hover={{
                  bg: "var(--hover-color)",
                }}
              >
                Gửi lại OTP
              </Button>
            )}
          </>
        );
      case 3:
        return (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Đặt Lại Mật Khẩu
            </Text>
            <Text mb="4">Vui lòng nhập mật khẩu mới và xác nhận.</Text>
            <Input
              placeholder="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              bg="#f7f7f7"
              border="2px solid var(--primary-color)"
              color="black"
              borderRadius="0"
              px="4"
              _hover={{
                boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
              }}
              _focus={{
                borderColor: "var(--primary-color)",
              }}
              mb="3"
            />
            <Input
              placeholder="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              bg="#f7f7f7"
              border="2px solid var(--primary-color)"
              color="black"
              borderRadius="0"
              px="4"
              _hover={{
                boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
              }}
              _focus={{
                borderColor: "var(--primary-color)",
              }}
              mb="3"
            />
            {error && <Text color="red">{error}</Text>}
            <Button
              onClick={handleResetPassword}
              isLoading={loading}
              bg="var(--primary-color)"
              color="white"
              _hover={{
                bg: "var(--hover-color)",
              }}
            >
              Đặt lại mật khẩu
            </Button>
          </>
        );
      case 4:
        return (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Thành Công!
            </Text>
            <Text mb="4"color = "green.300">Mật khẩu của bạn đã được đặt lại thành công.</Text>
            <Button
              as={RouterLink}
              to="/login"
              bg="var(--primary-color)"
              color="white"
              _hover={{
                bg: "var(--hover-color)",
              }}
            >
              Đăng nhập
            </Button>
          </>
        );
      default:
        return null;
    }
  };

return (
  <Box
    maxW={{ base: "90%", sm: "80%", md: "70%", lg: "50%" }}
    mx="auto"
    my="20"
  >
    {/* Steps */}
    <Stepper index={step - 1} orientation="horizontal" height="auto">
      {/* Step 1 */}
      <Step>
        <Box display="flex" flexDirection="column" alignItems="center">
          <StepIndicator
            sx={{
              borderColor: step === 1 ? "var(--hover-color)" : "var(--primary-color)", // Border màu hover khi active
              bg: step > 1 ? "var(--primary-color) !important" : "transparent", // Nền khi hoàn thành
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              boxShadow: step === 1 ? "0 0 8px rgba(106, 144, 137, 0.6)" : "none", // Box shadow khi active
              transition: "all 0.3s ease", // Hiệu ứng chuyển đổi
            }}
          >
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <StepTitle fontSize={{ base: "0.75rem", md: "1rem" }}>
            Nhập Email
          </StepTitle>
        </Box>
        <StepSeparator
          style={{
            border: "none", // Loại bỏ viền
            background: step > 1 ? "var(--primary-color)" : "rgb(0 0 0)",
            height: "3px",
            transition: "background-color 0.3s ease", // Hiệu ứng chuyển đổi
          }}
        />
      </Step>

      {/* Step 2 */}
      <Step>
        <Box display="flex" flexDirection="column" alignItems="center">
          <StepIndicator
            sx={{
              borderColor: step === 2 ? "var(--hover-color)" : "var(--primary-color)", // Border màu hover khi active
              bg: step > 2 ? "var(--primary-color) !important" : "transparent", // Nền khi hoàn thành
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              boxShadow: step === 2 ? "0 0 8px rgba(106, 144, 137, 0.6)" : "none", // Box shadow khi active
              transition: "all 0.3s ease", // Hiệu ứng chuyển đổi
            }}
          >
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <StepTitle fontSize={{ base: "0.75rem", md: "1rem" }}>
            Xác thực OTP
          </StepTitle>
        </Box>
        <StepSeparator
          style={{
            border: "none", // Loại bỏ viền
            background: step > 2 ? "var(--primary-color)" : "rgb(0 0 0)",
            height: "3px",
            transition: "background-color 0.3s ease", // Hiệu ứng chuyển đổi
          }}
        />
      </Step>

      {/* Step 3 */}
      <Step>
        <Box display="flex" flexDirection="column" alignItems="center">
          <StepIndicator
            sx={{
              borderColor: step === 3 ? "var(--hover-color)" : "var(--primary-color)", // Border màu hover khi active
              bg: step > 3 ? "var(--primary-color) !important" : "transparent", // Nền khi hoàn thành
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              boxShadow: step === 3 ? "0 0 8px rgba(106, 144, 137, 0.6)" : "none", // Box shadow khi active
              transition: "all 0.3s ease", // Hiệu ứng chuyển đổi
            }}
          >
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <StepTitle fontSize={{ base: "0.75rem", md: "1rem" }}>
            Đặt lại mật khẩu
          </StepTitle>
        </Box>
        <StepSeparator
          style={{
            border: "none", // Loại bỏ viền
            background: step > 3 ? "var(--primary-color)" : "rgb(0 0 0)",
            height: "3px",
            transition: "background-color 0.3s ease", // Hiệu ứng chuyển đổi
          }}
        />
      </Step>
    </Stepper>

    {/* Render step content */}
    <Box mt="6">{renderStep()}</Box>
  </Box>
);
};

export default ForgotPassword;