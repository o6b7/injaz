'use client'

import React, { useState } from 'react'
import ProjectHeader from '../ProjectHeader'
import Board from '../BoardView'
import List from '../ListView'
import Timeline from '../TimelineView'
import TasksTable from '../TasksTable'
import ModalNewTask from '@/components/ModalNewTask'

type Props = {
    params: {id: string}
}

const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("لوحة");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      <ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} projectId={Number(id)}/>
      
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
      
      { activeTab === "لوحة" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === "قائمة" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === "الجدول الزمني" && (        
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === "جدول" && (        
          <TasksTable
            projectId={Number(id)}
            showBulkActions={true}
            compact={false}
          title="جدول المهام"
          />
      )}
    </div>
  )
}

export default Project