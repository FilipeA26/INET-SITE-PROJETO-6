import MediaCard from "./MediaCard";

export default function SmartHomeMedia({ local = false }: { local?: boolean }) {
  const path = local ? "" : "/internet";
  return (
    <div className="grid min-w-0 gap-x-7 gap-y-12 md:grid-cols-2 xl:gap-x-10">
      <MediaCard to={`${path}#seguranca`} src="/casa/seg-poster.webp" alt="Câmera Wi-Fi Intelbras Mibo" title="Sua casa sempre à vista." description="Veja a casa de onde estiver, em tempo real." />
      <MediaCard to={`${path}#alexa`} src="/casa/alexa-poster.webp" alt="Alexa em casa" title="Fale e a casa obedece." description="A Alexa se conecta pelo Wi-Fi a lâmpadas, tomadas, TV e câmeras compatíveis." objectPosition="75% center" />
    </div>
  );
}
