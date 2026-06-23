-- Dish-specific cover images for the 20 seed recipes.
-- Real, license-free Unsplash photos (free, non-premium — hotlinkable).
-- Each photo was matched to its dish and verified to load.
update "Recipe" r set cover_img_url = v.url
from (values
('a0000000-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80'), -- שקשוקה
('a0000000-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80'), -- חביתה
('a0000000-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80'), -- פנקייק
('a0000000-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1560611588-163f295eb145?auto=format&fit=crop&w=800&q=80'), -- שניצל עוף
('a0000000-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=800&q=80'), -- פרגיות בסיר אחד
('a0000000-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1633959639799-6d3f66e05710?auto=format&fit=crop&w=800&q=80'), -- תפוחי אדמה בתנור
('a0000000-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1607877200924-1762edf69437?auto=format&fit=crop&w=800&q=80'), -- קציצות טונה
('a0000000-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=800&q=80'), -- פסטה שמנת ועוף
('a0000000-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1619452357216-e88ca8119eeb?auto=format&fit=crop&w=800&q=80'), -- פוקצה
('a0000000-0000-0000-0000-000000000010'::uuid, 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80'), -- מרק אפונה ובטטה
('a0000000-0000-0000-0000-000000000011'::uuid, 'https://images.unsplash.com/photo-1469307517101-0b99d8fb0c33?auto=format&fit=crop&w=800&q=80'), -- מרק עוף
('a0000000-0000-0000-0000-000000000012'::uuid, 'https://images.unsplash.com/photo-1666599207746-0868c6a556d2?auto=format&fit=crop&w=800&q=80'), -- טמפורה ירקות
('a0000000-0000-0000-0000-000000000013'::uuid, 'https://images.unsplash.com/photo-1646502094504-a27b89b13aeb?auto=format&fit=crop&w=800&q=80'), -- סלט תפוחי אדמה עם טונה
('a0000000-0000-0000-0000-000000000014'::uuid, 'https://images.unsplash.com/photo-1593895648796-9139c6bee45c?auto=format&fit=crop&w=800&q=80'), -- סלט תפוחי אדמה פריך
('a0000000-0000-0000-0000-000000000015'::uuid, 'https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?auto=format&fit=crop&w=800&q=80'), -- חומוס
('a0000000-0000-0000-0000-000000000016'::uuid, 'https://images.unsplash.com/photo-1623583659399-e1fd4d64a691?auto=format&fit=crop&w=800&q=80'), -- סלט ישראלי
('a0000000-0000-0000-0000-000000000017'::uuid, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80'), -- עוגת שוקולד
('a0000000-0000-0000-0000-000000000018'::uuid, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'), -- עוגיות שוקולד צ'יפס
('a0000000-0000-0000-0000-000000000019'::uuid, 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=800&q=80'), -- מגולגלות תמרים
('a0000000-0000-0000-0000-000000000020'::uuid, 'https://images.unsplash.com/photo-1551578657-a7e74acb0135?auto=format&fit=crop&w=800&q=80')  -- מוס שוקולד
) as v(id, url)
where r.id = v.id;
