import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { supabase } from '../../lib/supabaseClient';

interface Property {
  name: string;
  location: string;
}

interface PropertyPageProps {
  property: Property | null;
}

export default function PropertyPage({ property }: PropertyPageProps) {
  if (!property) {
    return (
      <Layout>
        <main className="bg-white text-gray-900">
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-5xl font-bold mb-8 text-center">物件が見つかりませんでした</h1>
            </div>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="bg-white text-gray-900">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-8 text-center">{property.name}の物件詳細</h1>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">{property.name}</h2>
              <p className="text-lg mb-4">所在地: {property.location}</p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  const { data, error } = await supabase
    .from('properties')
    .select('name, location')
    .eq('id', id)
    .single();

  if (error || !data) {
    return {
      props: {
        property: null,
      },
    };
  }

  return {
    props: {
      property: data as Property,
    },
  };
};