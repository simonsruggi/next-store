-- Seed data for Next Store

-- Categories
INSERT INTO categories (id, name, slug, description, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Elettronica', 'elettronica', 'Dispositivi elettronici e accessori', true),
  ('c1000000-0000-0000-0000-000000000002', 'Abbigliamento', 'abbigliamento', 'Moda uomo e donna', true),
  ('c1000000-0000-0000-0000-000000000003', 'Casa e Giardino', 'casa-giardino', 'Articoli per la casa', true),
  ('c1000000-0000-0000-0000-000000000004', 'Libri Digitali', 'libri-digitali', 'eBook e contenuti digitali', true);

-- Products
INSERT INTO products (id, name, slug, description, price, compare_at_price, type, category_id, sku, stock_quantity, is_active, is_featured) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Smartphone Pro Max', 'smartphone-pro-max', 'L''ultimo modello di smartphone con fotocamera avanzata, processore velocissimo e batteria a lunga durata. Display AMOLED da 6.7 pollici.', 899.99, 999.99, 'physical', 'c1000000-0000-0000-0000-000000000001', 'PHONE-001', 50, true, true),
  ('p1000000-0000-0000-0000-000000000002', 'Laptop Ultraleggero', 'laptop-ultraleggero', 'Notebook professionale con schermo 14" 4K, 16GB RAM, SSD da 512GB. Perfetto per lavoro e studio.', 1299.00, null, 'physical', 'c1000000-0000-0000-0000-000000000001', 'LAPTOP-001', 25, true, true),
  ('p1000000-0000-0000-0000-000000000003', 'Cuffie Wireless Premium', 'cuffie-wireless-premium', 'Cuffie over-ear con cancellazione attiva del rumore, audio Hi-Fi, 30 ore di autonomia.', 249.99, 299.99, 'physical', 'c1000000-0000-0000-0000-000000000001', 'AUDIO-001', 100, true, true),
  ('p1000000-0000-0000-0000-000000000004', 'T-Shirt Basic', 't-shirt-basic', 'T-shirt in cotone 100% organico, disponibile in vari colori. Vestibilità regolare.', 29.99, null, 'physical', 'c1000000-0000-0000-0000-000000000002', 'TSHIRT-001', 200, true, false),
  ('p1000000-0000-0000-0000-000000000005', 'Jeans Slim Fit', 'jeans-slim-fit', 'Jeans in denim di alta qualità, taglio slim fit moderno. Lavaggio medio.', 79.99, 99.99, 'physical', 'c1000000-0000-0000-0000-000000000002', 'JEANS-001', 80, true, true),
  ('p1000000-0000-0000-0000-000000000006', 'Felpa con Cappuccio', 'felpa-cappuccio', 'Felpa confortevole in cotone felpato, perfetta per le giornate fresche.', 59.99, null, 'physical', 'c1000000-0000-0000-0000-000000000002', 'FELPA-001', 120, true, false),
  ('p1000000-0000-0000-0000-000000000007', 'Set Pentole Antiaderenti', 'set-pentole-antiaderenti', 'Set completo di 8 pentole e padelle con rivestimento antiaderente professionale.', 149.99, 199.99, 'physical', 'c1000000-0000-0000-0000-000000000003', 'CUCINA-001', 40, true, true),
  ('p1000000-0000-0000-0000-000000000008', 'Lampada LED Smart', 'lampada-led-smart', 'Lampada da tavolo intelligente, controllo via app, 16 milioni di colori.', 49.99, null, 'physical', 'c1000000-0000-0000-0000-000000000003', 'LAMP-001', 75, true, false),
  ('p1000000-0000-0000-0000-000000000009', 'eBook: Guida al Marketing Digitale', 'ebook-marketing-digitale', 'Manuale completo sul marketing digitale: SEO, social media, advertising e analytics. 300+ pagine.', 19.99, 29.99, 'digital', 'c1000000-0000-0000-0000-000000000004', 'EBOOK-001', 999, true, true),
  ('p1000000-0000-0000-0000-000000000010', 'Corso Video: Programmazione Web', 'corso-programmazione-web', 'Corso completo di programmazione web: HTML, CSS, JavaScript, React. 50+ ore di video.', 99.99, 149.99, 'digital', 'c1000000-0000-0000-0000-000000000004', 'CORSO-001', 999, true, true);

-- Product Variants (for T-Shirt)
INSERT INTO product_variants (id, product_id, name, sku, price, stock_quantity, attributes, is_active) VALUES
  ('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000004', 'Bianco - S', 'TSHIRT-001-WH-S', null, 30, '{"colore": "Bianco", "taglia": "S"}', true),
  ('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000004', 'Bianco - M', 'TSHIRT-001-WH-M', null, 40, '{"colore": "Bianco", "taglia": "M"}', true),
  ('v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000004', 'Bianco - L', 'TSHIRT-001-WH-L', null, 35, '{"colore": "Bianco", "taglia": "L"}', true),
  ('v1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000004', 'Nero - S', 'TSHIRT-001-BK-S', null, 25, '{"colore": "Nero", "taglia": "S"}', true),
  ('v1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000004', 'Nero - M', 'TSHIRT-001-BK-M', null, 45, '{"colore": "Nero", "taglia": "M"}', true),
  ('v1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000004', 'Nero - L', 'TSHIRT-001-BK-L', null, 25, '{"colore": "Nero", "taglia": "L"}', true);

-- Product Variants (for Jeans)
INSERT INTO product_variants (id, product_id, name, sku, price, stock_quantity, attributes, is_active) VALUES
  ('v1000000-0000-0000-0000-000000000007', 'p1000000-0000-0000-0000-000000000005', 'Taglia 30', 'JEANS-001-30', null, 15, '{"taglia": "30"}', true),
  ('v1000000-0000-0000-0000-000000000008', 'p1000000-0000-0000-0000-000000000005', 'Taglia 32', 'JEANS-001-32', null, 25, '{"taglia": "32"}', true),
  ('v1000000-0000-0000-0000-000000000009', 'p1000000-0000-0000-0000-000000000005', 'Taglia 34', 'JEANS-001-34', null, 25, '{"taglia": "34"}', true),
  ('v1000000-0000-0000-0000-000000000010', 'p1000000-0000-0000-0000-000000000005', 'Taglia 36', 'JEANS-001-36', null, 15, '{"taglia": "36"}', true);

-- Product Images (placeholder URLs - replace with actual images)
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', 'Smartphone Pro Max', 0),
  ('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', 'Laptop Ultraleggero', 0),
  ('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'Cuffie Wireless Premium', 0),
  ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'T-Shirt Basic', 0),
  ('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 'Jeans Slim Fit', 0),
  ('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600', 'Felpa con Cappuccio', 0),
  ('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'Set Pentole Antiaderenti', 0),
  ('p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 'Lampada LED Smart', 0),
  ('p1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'eBook Marketing Digitale', 0),
  ('p1000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Corso Programmazione Web', 0);
