'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Project = {
  id:number;
  title:string;
  description:string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login'); // ログインしていなければ/loginへ
      } else {
        setSession(data.session);
        setLoading(false);
        //とりあえずダミーデータ
        setProjects([
          {id:1,title: 'Next.js ポートフォリオ', description: 'ポートフォリオサイトの作成'},
          {id:2,title: 'Todoアプリ', description: 'React + SupabaseでCRUDm実装'},
        ]);
      }
    };
    checkAuth();

    // 認証状態が変わった場合に追従
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setSession(session);
    });


    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl mb-4">プロジェクト一覧</h1>
      <p>ようこそ、{session.user.email}さん！</p>
    
      <div className='space-y-4'>
        {projects.map((project) => (
        <div
          key={project.id}
          className='p-4 border rounded hover:shadow cursor-pointer'
          onClick={()=> router.push(`/projects/${project.id}`)}
        >
          <h2 className='text-xl font-bold'>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
      </div>

      <button
        className='mt-6 bg-red-500 text-white px-4 py-2 rounded'
        onClick={async ()=>{
          await supabase.auth.signOut();
          router.push('/login')
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
