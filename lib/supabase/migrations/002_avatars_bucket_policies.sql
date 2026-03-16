-- ============================================================
-- Mamy Style — RLS policies for the 'avatars' storage bucket
-- Run this in your Supabase SQL Editor
-- ============================================================
-- Path format: {userId}/avatar.{ext}
-- storage.foldername(name)[1] extracts the first folder (= userId)

-- Anyone can view avatars (public profile pictures)
CREATE POLICY "Avatars are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users can replace their own avatar (upsert)
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
