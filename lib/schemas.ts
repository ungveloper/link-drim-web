import { z } from "zod";
import { isSafeHref, isValidSlug } from "@/lib/templates";
const hex=z.string().regex(/^#[0-9a-fA-F]{6}$/);
const item=z.object({id:z.string().min(1).max(80),title:z.string().max(100),url:z.string().max(2000).refine(v=>!v||isSafeHref(v),"올바른 웹 주소, 전화 또는 이메일 링크를 입력하세요."),visible:z.boolean(),pinned:z.boolean()});
export const contentSchema=z.object({
  name:z.string().max(100),headline:z.string().max(160),bio:z.string().max(6000),imageUrl:z.string().max(2048),backgroundUrl:z.string().max(2048),
  phone:z.string().max(80),email:z.union([z.literal(""),z.email()]),organization:z.string().max(120),instagram:z.string().max(2048),threads:z.string().max(2048),youtube:z.string().max(2048),
  theme:z.object({primary:hex,secondary:hex,background:hex}),linkDisplay:z.enum(["list","card"]),links:z.array(item),
});
export const selectionSchema=z.array(z.object({key:z.enum(["profile","business-card","link"]),enabled:z.boolean(),version:z.string().max(25)})).max(3);
export const saveSchema=z.object({siteId:z.uuid(),revision:z.number().int().min(0),slug:z.string().refine(isValidSlug,"사용할 수 없는 주소입니다."),content:contentSchema,templates:selectionSchema,homeTemplate:z.enum(["profile","business-card","link"]).nullable()});
export const createSiteSchema=z.object({name:z.string().trim().min(1).max(100),slug:z.string().refine(isValidSlug),isPublished:z.boolean()});
