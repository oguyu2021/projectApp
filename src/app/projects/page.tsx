'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login'); // ログインしていなければ/loginへ
      } else {
        setSession(data.session);
        setLoading(false);
      }
    };
    getSession();

    // 認証状態が変わった場合に追従
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
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
      {/* ここにプロジェクト一覧を表示する */}
    </div>
  );
}
