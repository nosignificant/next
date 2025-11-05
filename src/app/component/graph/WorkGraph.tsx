import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import type { GData } from "@/app/lib/type";

type GraphProps = {
  sortedNode: GData;
  handleSelected: (slug: string) => void;
};

export default function WorkGraph({ sortedNode, handleSelected }: GraphProps) {
  const fgRef = useRef<ForceGraphMethods>();

  // 하나의 TextureLoader 재사용
  const texLoader = useMemo(() => new THREE.TextureLoader(), []);
  const textureCache = useMemo(() => new Map<string, THREE.Texture>(), []);

  // ✅ 원본 비율 유지 스프라이트
  const getSprite = (url: string, heightSize = 16) => {
    const mat = new THREE.SpriteMaterial({
      transparent: true,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    // 로딩 전 임시 크기(정사각). 로딩되면 비율로 갱신
    sprite.scale.set(heightSize, heightSize, 1);

    const useTexture = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      mat.needsUpdate = true;

      const img: any = tex.image;
      if (img?.width && img?.height) {
        const aspect = img.width / img.height;
        sprite.scale.set(heightSize * aspect, heightSize, 1); // ← 가로만 비율대로
      }
    };

    const cached = textureCache.get(url);
    if (cached && (cached.image as any)?.width) {
      // ✅ 캐시 히트: 즉시 비율 적용
      useTexture(cached);
    } else {
      texLoader.load(
        url,
        (tex) => {
          textureCache.set(url, tex);
          useTexture(tex);
        },
        undefined,
        () => {
          // 실패 시 기본 원형 메쉬로 대체하고 싶다면 여기서 처리 가능
        }
      );
    }

    return sprite;
  };

  const getFallbackMesh = (node: any) => {
    const geo = new THREE.SphereGeometry(6, 16, 16);
    const color = node.type === "tag" ? 0x6aa5ff : 0xffc857;
    const mat = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geo, mat);
  };

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={sortedNode}
      nodeLabel={(n: any) => n.label}
      nodeAutoColorBy={undefined}
      backgroundColor="rgba(0,0,0,0)"
      rendererConfig={{ alpha: true, antialias: true }}
      linkColor={() => "#000"} // ✅ 링크 색을 검은색으로 고정
      linkOpacity={1} // (선택) 불투명도 조절
      linkWidth={0.1} // (선택) 선 굵기 조절
      nodeThreeObject={(node: any) => {
        if (node.type === "post" && node.thumbnail) {
          return getSprite(node.thumbnail, 16);
        }
        return getFallbackMesh(node);
      }}
      nodeThreeObjectExtend={false}
      onNodeClick={(node: any) => {
        if (node.slug) handleSelected(node.slug);

        const distance = 40;
        const x = (node.x as number) ?? 0;
        const y = (node.y as number) ?? 0;
        const z = (node.z as number) ?? 0;

        const len = Math.hypot(x, y, z) || 1;
        const distRatio = 1 + distance / len;
        const newPos =
          x || y || z
            ? { x: x * distRatio, y: y * distRatio, z: z * distRatio }
            : { x: 0, y: 0, z: distance };

        fgRef.current?.cameraPosition(newPos, node, 3000);
      }}
    />
  );
}
