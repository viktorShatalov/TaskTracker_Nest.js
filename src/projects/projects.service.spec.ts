import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProjectsService } from './projects.service.js';

describe('ProjectsService.remove', () => {
  it('deletes the project and returns confirmation', async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const prisma = { project: { deleteMany } } as unknown as PrismaService;
    const service = new ProjectsService(prisma);

    await expect(service.remove('project-id')).resolves.toEqual({ deleted: true });
    expect(deleteMany).toHaveBeenCalledWith({ where: { id: 'project-id' } });
  });

  it('returns not found when the project does not exist', async () => {
    const prisma = {
      project: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    } as unknown as PrismaService;
    const service = new ProjectsService(prisma);

    await expect(service.remove('missing-project')).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('ProjectsService.update', () => {
  it('updates and returns the project', async () => {
    const updatedProject = { id: 'project-id', name: 'Updated name' };
    const project = {
      findUnique: vi.fn().mockResolvedValue({ id: 'project-id' }),
      update: vi.fn().mockResolvedValue(updatedProject),
    };
    const service = new ProjectsService({ project } as unknown as PrismaService);

    await expect(service.update('project-id', { name: 'Updated name' })).resolves.toEqual(updatedProject);
    expect(project.update).toHaveBeenCalledWith({
      where: { id: 'project-id' },
      data: { name: 'Updated name' },
    });
  });

  it('returns not found when the project does not exist', async () => {
    const project = { findUnique: vi.fn().mockResolvedValue(null) };
    const service = new ProjectsService({ project } as unknown as PrismaService);

    await expect(service.update('missing-project', { name: 'Updated name' })).rejects.toBeInstanceOf(NotFoundException);
  });
});