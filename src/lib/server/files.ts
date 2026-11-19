import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const uploads = path.join(process.cwd(), 'data', 'uploads');
const portraits = path.join(process.cwd(), 'data', 'portraits');

const documents = new Set(['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.webp']);
const images = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function safeExt(filename: string, allowed: Set<string>) {
	const ext = path.extname(filename).toLowerCase();
	if (!allowed.has(ext)) return null;
	return ext;
}

async function store(dir: string, file: File, allowed: Set<string>, limit: number) {
	if (file.size === 0) return null;
	if (file.size > limit) throw new Error('That file is larger than the 8 MB limit.');
	const ext = safeExt(file.name, allowed);
	if (!ext) throw new Error('That file type is not accepted.');
	await mkdir(dir, { recursive: true });
	const storedName = `${crypto.randomUUID()}${ext}`;
	const bytes = Buffer.from(await file.arrayBuffer());
	await writeFile(path.join(dir, storedName), bytes);
	return {
		storedName,
		originalName: path.basename(file.name).slice(0, 180),
		mime: file.type || 'application/octet-stream',
		size: bytes.length
	};
}

function resolveStored(dir: string, storedName: string) {
	if (!/^[a-z0-9-]+\.[a-z0-9]+$/i.test(storedName)) throw new Error('Invalid file');
	return path.join(dir, storedName);
}

export function saveDocument(file: File) {
	return store(uploads, file, documents, 8 * 1024 * 1024);
}

export function savePortrait(file: File) {
	return store(portraits, file, images, 4 * 1024 * 1024);
}

export function readDocument(storedName: string) {
	return readFile(resolveStored(uploads, storedName));
}

export function readPortrait(storedName: string) {
	return readFile(resolveStored(portraits, storedName));
}

export async function removeStored(kind: 'document' | 'portrait', storedName: string | null) {
	if (!storedName) return;
	const dir = kind === 'document' ? uploads : portraits;
	try {
		await unlink(resolveStored(dir, storedName));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
	}
}
