import { Injectable } from '@angular/core';
import { UploadKind, UploadQueueItem, UploadStrategy } from '../../shared/models/content.models';

function extensionFor(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

@Injectable({
  providedIn: 'root',
})
export class UploadClassifierService {
  classify(file: File): UploadQueueItem {
    const kind = this.kindFor(file);
    return {
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      kind,
      strategy: this.strategyFor(kind),
    };
  }

  private kindFor(file: File): UploadKind {
    const extension = extensionFor(file.name);

    if (file.type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'Image';
    }

    if (file.type.startsWith('video/') || file.type.startsWith('audio/') || ['mp4', 'mov', 'mp3', 'wav'].includes(extension)) {
      return 'Media';
    }

    if (['csv', 'json', 'xml', 'parquet'].includes(extension)) {
      return 'Data file';
    }

    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(extension)) {
      return 'Document';
    }

    return 'Other';
  }

  private strategyFor(kind: UploadKind): UploadStrategy {
    switch (kind) {
      case 'Image':
        return 'Preview and optimize';
      case 'Document':
        return 'Scan and store';
      case 'Media':
        return 'Transcode or chunk';
      case 'Data file':
        return 'Validate schema';
      case 'Other':
        return 'Manual review';
    }
  }
}
