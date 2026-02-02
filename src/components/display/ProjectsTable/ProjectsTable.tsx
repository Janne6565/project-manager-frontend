import { useState } from 'react';
import type { Project } from '@/types/project';
import { useAppDispatch } from '@/store/hooks';
import { updateProjectIndex, deleteProject, reorderProjectsOptimistically } from '@/store/slices/projectsSlice';
import { DataTable } from '@/components/display/DataTable/DataTable';
import { createProjectColumns } from './columns';
import { ProjectDetailDrawer } from '@/components/display/ProjectDetailDrawer/ProjectDetailDrawer';

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const dispatch = useAppDispatch();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDragEnd = async (reorderedProjects: Project[]) => {
    // Optimistically update the UI
    dispatch(reorderProjectsOptimistically(reorderedProjects));

    // Update each project's index in the backend
    try {
      await Promise.all(
        reorderedProjects.map((project, index) =>
          dispatch(updateProjectIndex({ uuid: project.uuid, index }))
        )
      );
    } catch (error) {
      console.error('Failed to update project order:', error);
      // Could add toast notification here
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        await dispatch(deleteProject(project.uuid));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const columns = createProjectColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onRowClick: handleRowClick,
  });

  return (
    <>
      <DataTable data={projects} columns={columns} onDragEnd={handleDragEnd} />
      {selectedProject && (
        <ProjectDetailDrawer
          project={selectedProject}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </>
  );
}
