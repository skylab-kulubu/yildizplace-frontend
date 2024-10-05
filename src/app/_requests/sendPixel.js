import { DOMAIN } from "../_utils/constants";

export const sendPixel = function (row, col, color) {
  return fetch(`${DOMAIN}/api/pixels/addPixel`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x: row,
      y: col,
      color: color.toString(16),
    }),
    credentials: "include",
  })
    .then((response) => {
      // Eğer 403 hatası alırsak otomatik logout yap
      if (response.status === 403) {
        // Kullanıcıyı logout yap
        fetch(`${DOMAIN}/api/users/logout`, {
          method: "GET",
          credentials: "include",
        })
          .then(() => {
            // Sayfayı yenileyerek logout işlemini tamamla
            window.location.reload();
          })
          .catch((error) => {
            console.error("Logout işlemi başarısız oldu: ", error);
          });
        // 403 durumunda işlemi sonlandır
        return null;
      }
      // Diğer durumlar için JSON verisini dön
      return response.json();
    })
    .then((data) => {
      if (!data) return;

      // Eğer success false ise ve mesaj 'Bu kullanıcı yasaklı!' ise logout yap
      if (data.success === false && data.message === "Bu kullanıcı yasaklı!") {
        // Kullanıcıyı logout yap
        fetch(`${DOMAIN}/api/users/logout`, {
          method: "GET",
          credentials: "include",
        })
          .then(() => {
            // Sayfayı yenileyerek logout işlemini tamamla
            window.location.reload();
          })
          .catch((error) => {
            console.error("Logout işlemi başarısız oldu: ", error);
          });
      }

      // Başarılı durumlar için data'yı döndür
      return data.data;
    })
    .catch((error) => console.error("Parsing error: ", error));
};
