interface CardProps {
  title: string;
  tel: string;
  address: string;
}

const Card = ({ title, tel, address }: CardProps) => {
  const openNaverDirections = (name: string, address: string) => {
    const destination = encodeURIComponent(name + ' ' + address);

    const googleMapUrl = `comgooglemaps://?q=${destination}`;
    const webMapUrl = `https://maps.google.com/maps?q=${destination}`;
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = googleMapUrl;

      setTimeout(() => {
        window.open(webMapUrl, '_blank');
      }, 1000);
    } else {
      window.open(webMapUrl, '_blank');
    }
  };

  const makeCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  return (
    <div className="max-h-96">
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-primary-content">{title}</h3>
        <p
          onClick={() => openNaverDirections(title, address)}
          className="text-sm text-accent-content mt-1">
          {address}
        </p>
        <p
          onClick={() => makeCall(tel)}
          className="text-sm text-primary mt-2">
          {tel}
        </p>
      </div>
    </div>
  );
};

export default Card;
