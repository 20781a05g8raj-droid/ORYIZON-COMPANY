-- 1. Reset: Delete the user if they exist to start fresh
DELETE FROM auth.identities WHERE email = 'admin@oryizon.com';
DELETE FROM auth.users WHERE email = 'admin@oryizon.com';

-- 2. Create the User in auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID for consistency
    'authenticated',
    'authenticated',
    'admin@oryizon.com',
    crypt('admin123', gen_salt('bf')), -- Password: admin123
    now(), -- Auto-confirm
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
);

-- 3. Create the Identity in auth.identities (CRITICAL for login to work)
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Must match user_id above
    format('{"sub":"%s","email":"%s"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@oryizon.com')::jsonb,
    'email',
    'admin@oryizon.com',
    now(),
    now(),
    now()
);
