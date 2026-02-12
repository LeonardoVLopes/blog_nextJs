type PostSlugPagePros = {
  params: Promise<{ slug: string }>;
};

export default async function PostSlugPage({ params }: PostSlugPagePros) {
  const { slug } = await params;
  return <h1 className="text-7xl font-extrabold py-16">Ola mundo: {slug}</h1>;
}
