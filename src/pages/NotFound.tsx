import { Link } from "react-router-dom";
import { PageHero, usePageMeta } from "../components/ui";

export default function NotFound() {
  usePageMeta("Página não encontrada", "A página que você procura não existe ou mudou de endereço.");
  return (
    <PageHero tag="Erro 404" title={["Essa fibra", <span className="italic text-lime">não chega aqui.</span>]} lead="A página que você procura não existe ou mudou de endereço.">
      <Link to="/" className="btn-lime">Voltar ao início</Link>
      <Link to="/fale-conosco" className="btn-ghost">Fale conosco</Link>
    </PageHero>
  );
}
