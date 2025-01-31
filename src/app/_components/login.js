"use client";

import { useRef, useState } from "react";
import { sendInviteLink } from "../_requests/sendInviteLink";

export const Login = () => {
  const [isLoginShowing, setIsLoginShowing] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false); // State for controlling KVKK modal
  const [message, setMessage] = useState("");
  const [banReason, setBanReason] = useState(""); // Yasaklama nedeni
  const email = useRef("");

  const handleForm = (event) => {
    event.preventDefault();
    setBanReason("");
    setHasRegistered(false);
    setMessage("");
    

    if (!kvkkAccepted) {
      setHasError(true);
      setMessage("Lütfen KVKK metnini onaylayın.");
      return;
    }

    setHasError(false);
    setIsRequestPending(true);
    sendInviteLink(email.current.value)
      .then((data) => {
        setIsRequestPending(false);
        setHasRegistered(true);
        if (data.success) {
          setMessage(data.message);

        } else {
          setHasError(true);
          setMessage(data.message);
          if (data.message === "Bu kullanıcı yasaklı!") {
            setBanReason(data.data.reason);
          }
        }
      })
      .catch((error) => {
        setIsRequestPending(false);
        setHasError(true);
        setMessage("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
        console.log("Error: ", error);
      });
  };

  return (
    <>
      <div
        className="flex justify-center items-center absolute top-4 right-4 w-8 h-8 bg-white hover:bg-slate-200 transition-colors duration-500 rounded-full select-none cursor-pointer container-shadow z-10"
        onClick={() => {
          setIsLoginShowing((currentIsLoginShowing) => !currentIsLoginShowing);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
        </svg>
      </div>
      <div
        className={`flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 md:w-1/3 py-4 px-8 bg-white border-2 border-black pixel-box-shadow select-none z-20 ${
          isLoginShowing ? "" : "hidden"
        }`}
      >
        <h1 className="text-lg font-bold mb-2">Giriş Yap</h1>
        <form onSubmit={handleForm}>
          <div className="mb-3">
            Etkinliğe katılmak için, lütfen aşağıdaki boşluğa üniversite e-posta
            adresinizi girin. Ardından, e-posta adresinize bir giriş bağlantısı
            alacaksınız. Bu bağlantıya tıklayarak etkinliğimize katılabilir ve
            üniversitemizin sanal duvarını oluşturabilirsiniz!
            <br />
            <h3 className="text-red-600 font-bold">
              Okul maillerine gönderilen mailler okul kaynaklı 10-15 dakika
              gecikmeli düşebiliyor, kayıt olduktan sonra lütfen bu durumu göz
              önünde bulundurunuz.
            </h3>
          </div>
          <div className="flex flex-col mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              YTÜ Üniversite E-Postanız
            </label>

            <input
              type="email"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm ${
                hasError ? "ring-2 ring-red-500" : ""
              } focus:ring-blue-500 focus:border-blue-500 p-2.5`}
              placeholder="YTU e-postanızı giriniz."
              required
              ref={email}
            />
          </div>
          <div className="flex items-start mb-3">
            <input
              type="checkbox"
              id="kvkk-checkbox"
              className="mr-2"
              onChange={(e) => setKvkkAccepted(e.target.checked)}
            />
            <label
              className="text-sm cursor-pointer underline"
              onClick={() => setIsKvkkModalOpen(true)}
            >
              KVKK metnini okudum ve onaylıyorum.
            </label>
          </div>
          {message && (
            <div
              className={`mb-3 text-sm font-semibold ${
                hasError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </div>
          )}
          {banReason && (
            <div className="mb-3 text-sm font-semibold text-red-600">
              <p>Yasaklama nedeni: {banReason}</p>
            </div>
          )}
          <button
            type="submit"
            className={`text-white ${
              isRequestPending
                ? "bg-orange-700/60 hover:bg-orange-800/60"
                : "bg-orange-700 hover:bg-orange-800"
            } focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-500`}
            disabled={isRequestPending}
          >
            Katılım Bağlantısını Gönder
          </button>
        </form>
      </div>
      <div
        className="flex justify-center absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-orange-700 hover:bg-orange-800 text-white border-2 border-black pixel-box-shadow cursor-pointer select-none transition-colors duration-500"
        onClick={() => {
          setIsLoginShowing((currentIsLoginShowing) => !currentIsLoginShowing);
        }}
      >
        Piksel eklemek için giriş yap.
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black/60 ${
          isLoginShowing ? "" : "hidden"
        }`}
        onClick={() => {
          if (isLoginShowing) {
            setIsLoginShowing(false);
          }
        }}
      ></div>

       {/* KVKK Modal */}
       {isKvkkModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto" >
            <h2 className="text-lg font-bold mb-4">Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni</h2>
            <p className="text-sm mb-4">
              Yıldız Teknik Üniversitesi SKY LAB: Bilgisayar Bilimleri Kulübü
              (“SKY LAB" veya “Kulüp”) olarak, "YıldızPlace" adlı oyunumuz
              kapsamında işlenen kişisel verilerinizin korunmasına büyük önem
              vermekteyiz. 6698 sayılı Kişisel Verilerin Korunması Kanunu
              (“KVKK”) uyarınca, kişisel verilerinizin işlenmesi ve korunmasına
              ilişkin aşağıdaki bilgilendirmeyi sunarız.
            </p>
            <p className="text-sm mb-4">
              Kişisel verileriniz, e-posta adresi, IP adresi, giriş/ziyaret saat
              bilgileri gibi verilerden oluşmaktadır. Bu veriler, yalnızca oyuna
              erişiminizi sağlamak, sistem güvenliğini temin etmek ve teknik
              destek hizmetlerini sunmak amacıyla işlenmektedir.
            </p>
            <p className="text-sm mb-4">
              Kişisel verileriniz, SKY LAB bünyesinde saklanmakta olup üçüncü
              kişilerle paylaşılmamaktadır. Ancak, müstehcenlik, saldırganlık,
              ırkçı söylemler veya cinsellik içeren durumların tespiti halinde
              veya üniversite tarafından yasal bir bilgi talebi gelmesi
              durumunda, ilgili kişisel veriler Yıldız Teknik Üniversitesi ile
              paylaşılabilecektir.
            </p>
            <p className="text-sm mb-4">
              Kişisel verileriniz, SKY LAB tarafından saklanmakta olup 
              bu verilerin saklanmasına ilişkin tüm haklar SKY LAB'e aittir. 
              SKY LAB, aksini belirtmediği müddetçe verilerinizi saklamaya devam edecektir.
            </p>
            <p className="text-sm mb-4">
              Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse
              buna ilişkin bilgi talep etme, kişisel verilerinizin işlenme
              amacını öğrenme gibi haklarınız için bize her zaman ulaşabilirsiniz.
            </p>
            <button
              className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded"
              onClick={() => setIsKvkkModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
};
